# デプロイ手順(Xserver編)

## 開発から公開までの流れ(ローカルで作成 → サーバーで動かす)

```
[ローカルPC]                     [GitHub]                    [Xserver VPS]
 開発・動作確認  ── git push ──▶  リポジトリ  ── git pull ──▶  本番稼働
 (npm run dev)                  (このリポジトリ)              (STEP 1〜7で構築)
```

### ローカルでの作成・動作確認

お手元のPCに [Node.js LTS版](https://nodejs.org/ja)(インストーラーで「次へ」を押すだけ)と [Git](https://git-scm.com/downloads) を入れた上で:

```bash
git clone https://github.com/akihiroyamauchi2023/ai-photo-studio.git
cd ai-photo-studio

npm install
npm run dev
```

ブラウザで **http://localhost:3000** を開くと動作確認できます。
APIキーなしでも「デモモード」で全フロー(生成→プレビュー→購入→ダウンロード)を確認できます。
本物のAI生成を試す場合は `.env.example` を `.env.local` にコピーして `GEMINI_API_KEY` を設定してください。

- 文言・料金・シーンなどを編集 → 保存するとブラウザに即反映されます
- 完成したら `git add -A && git commit -m "変更内容" && git push` でGitHubへ

### サーバーへの反映

初回はこの下の STEP 1〜7 でVPSを構築します。**2回目以降の反映は3コマンドだけ**です:

```bash
cd /opt/ai-photo-studio && git pull && npm ci && npm run build && pm2 restart photo-studio
```

> 💡 FTPでのアップロードは不要です(というより、Node.jsアプリはFTPで置くだけでは動きません)。
> GitHubを経由することで、ローカルとサーバーの内容が常に一致し、巻き戻しも簡単になります。

---

## ⚠️ まず最初に: Xserverのプラン確認

本システムは **Node.js製(Next.js)のWebアプリ** です。Xserverのサービスによって対応が異なります。

| Xserverのサービス | 動作 | 備考 |
|---|---|---|
| **Xserver VPS** | ✅ 動作します | **推奨**。この手順書の対象(月830円〜のプランでOK) |
| Xserverレンタルサーバー(スタンダード等) | ❌ 動作しません | PHP用の共用サーバーのため、Node.jsアプリを常駐できません |
| Xserver Static | ❌ 動作しません | 静的サイト専用のため、AI生成・決済のサーバー処理が動きません |

> 現在「レンタルサーバー」契約のみの場合は、[Xserver VPS](https://vps.xserver.ne.jp/) を追加契約してください。
> メモリ2GBプラン以上を推奨します(画像処理を行うため)。
> ※ お使いの独自ドメインはそのまま利用できます(DNS設定でVPSに向けるだけです)。

---

## 全体像

```
[ユーザー] → https://ドメイン → [Nginx (リバースプロキシ+SSL)] → [Next.js (Node.js, port 3000)]
                                                                      ├── Gemini API (AI生成)
                                                                      ├── Stripe (決済)
                                                                      └── /var/photo-data (生成写真の保存)
```

## STEP 1: VPSの初期設定

1. Xserver VPS 契約時にOSは **Ubuntu 24.04** を選択(rootパスワード・SSHキーを設定)
2. VPSパネルの **「パケットフィルター」** で以下のポートを許可:
   - SSH (22)
   - Web (80)
   - Web SSL (443)
3. SSHで接続:

```bash
ssh root@<VPSのIPアドレス>
```

## STEP 2: 必要なソフトのインストール

```bash
# システム更新
apt update && apt upgrade -y

# Node.js 22 のインストール
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git nginx

# プロセス管理ツール PM2(アプリの常駐・自動再起動用)
npm install -g pm2

# 確認
node -v   # v22.x と表示されればOK
```

## STEP 3: アプリの配置とビルド

```bash
# アプリ用ユーザーで運用する場合は適宜読み替えてください
cd /opt
git clone https://github.com/akihiroyamauchi2023/ai-photo-studio.git
cd ai-photo-studio

npm ci

# 環境変数の設定
cp .env.example .env.local
nano .env.local
```

`.env.local` に以下を設定します:

```env
GEMINI_API_KEY=<Google AI Studioで取得したキー>
STRIPE_SECRET_KEY=<Stripeダッシュボードのシークレットキー sk_live_...>
STRIPE_WEBHOOK_SECRET=<STEP 6 で取得 whsec_...>
NEXT_PUBLIC_SITE_URL=https://<あなたのドメイン>
DATA_DIR=/var/photo-data
```

```bash
# 写真データ保存先の作成
mkdir -p /var/photo-data

# ビルド
npm run build
```

## STEP 4: PM2でアプリを常駐させる

```bash
cd /opt/ai-photo-studio
pm2 start npm --name photo-studio -- start
pm2 save
pm2 startup   # 表示されたコマンドをそのまま実行(サーバー再起動時に自動起動)
```

動作確認: `curl -I http://localhost:3000` で `200 OK` が返ればOKです。

## STEP 5: ドメイン・Nginx・SSL設定

### 5-1. ドメインをVPSに向ける

Xserverのドメイン管理(またはお使いのDNS)で **Aレコード** を作成:

```
photo.example.com  →  <VPSのIPアドレス>
```

### 5-2. Nginxリバースプロキシ

```bash
cat > /etc/nginx/sites-available/photo-studio <<'EOF'
server {
    listen 80;
    server_name photo.example.com;   # ← ご自身のドメインに変更

    client_max_body_size 20M;        # 写真アップロード用(15MB制限+余裕)

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;     # AI生成中の応答待ち
    }
}
EOF

ln -s /etc/nginx/sites-available/photo-studio /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 5-3. SSL証明書(無料・自動更新)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d photo.example.com   # ← ご自身のドメインに変更
```

これで `https://photo.example.com` でアクセスできるようになります。

## STEP 6: Stripe Webhookの登録

1. [Stripeダッシュボード](https://dashboard.stripe.com/webhooks) → 「エンドポイントを追加」
2. エンドポイントURL: `https://photo.example.com/api/webhook/stripe`
3. イベント: `checkout.session.completed` を選択
4. 発行された **署名シークレット (whsec_...)** を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定
5. 反映: `cd /opt/ai-photo-studio && npm run build && pm2 restart photo-studio`

## STEP 7: 動作確認チェックリスト

- [ ] `https://ドメイン` でトップページが表示される
- [ ] シーン選択 → 写真アップロード → 生成が完了する(デモモード表示が**出ていない**こと = Geminiキー有効)
- [ ] プレビューにブランド名(既定: HARENOHI)の透かしが入っている
- [ ] 購入ボタンでStripeの決済画面に遷移する(テストはStripeのテストキー + カード番号 `4242 4242 4242 4242`)
- [ ] 決済後、透かしなしの高解像度写真がダウンロードできる

---

## 更新(アップデート)手順

```bash
cd /opt/ai-photo-studio
git pull
npm ci
npm run build
pm2 restart photo-studio
```

## 運用メモ

- **ログ確認**: `pm2 logs photo-studio`
- **写真データ**: `/var/photo-data` に保存されます。ディスク使用量に注意し、必要に応じて古いジョブを削除してください(例: 30日より古いものを削除する場合)
  ```bash
  # cronに登録する例(毎日3時に30日以上前のジョブを削除)
  # crontab -e で以下を追加
  0 3 * * * find /var/photo-data/jobs -maxdepth 1 -mtime +30 -type d -exec rm -rf {} +
  ```
- **バックアップ**: XserverVPSパネルの自動バックアップ(有料オプション)または `/var/photo-data` の定期コピーを推奨
- **本番切替**: Stripeを本番キー(`sk_live_`)に切り替える際は、Webhookも本番モードで再登録が必要です
