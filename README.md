# AI Photo Studio

**あなたの一枚を、一生の一枚に。**(既定ブランド名: ハレノヒ写真館)

シーンを選んで手元の写真をアップロードするだけで、AIが超一流のプロ写真家が撮影したような記念写真に仕上げるWebサービスです。

| | |
|---|---|
| 🎯 対応シーン | プロフィール写真 / 七五三 / 結婚式前撮り(和装・洋装) / 遺影写真 / 成人式 / お宮参り・百日祝い / 家族写真 / マタニティ の9シーン |
| 💰 ビジネスモデル | 生成・透かし入りプレビューは**無料**、高解像度ダウンロード時に課金(フリーミアム) |
| 🤖 AI生成 | Google Gemini (gemini-2.5-flash-image) による image-to-image 変換 |
| 💳 決済 | Stripe Checkout(1枚330円〜、まとめ買い自動割引) |

## アーキテクチャ

```
Next.js 14 (App Router / TypeScript)
├── app/
│   ├── page.tsx                 … トップページ(シーン一覧・料金・FAQ)
│   ├── studio/                  … 撮影フロー(シーン選択→アップロード→枚数指定)
│   ├── gallery/[jobId]/         … 生成結果ギャラリー(透かしプレビュー・写真選択・購入)
│   ├── success/                 … 購入完了・高解像度ダウンロード
│   └── api/
│       ├── generate             … 生成ジョブ作成(バックグラウンド並列生成)
│       ├── job/[jobId]          … 進捗ポーリング
│       ├── preview/...          … 透かし入り無料プレビュー(sharp)
│       ├── checkout             … Stripe Checkout セッション作成
│       ├── webhook/stripe       … 決済確定Webhook
│       ├── confirm              … 決済検証(Webhook不達時のフォールバック兼用)
│       └── download/...         … 購入済み写真の高解像度ダウンロード(トークン認証)
└── lib/
    ├── scenes.ts    … シーン定義(プロ写真家品質のプロンプトカタログ)
    ├── generator.ts … 生成ジョブエンジン(並列度3)
    ├── gemini.ts    … Gemini API クライアント(キー未設定時はデモ生成)
    ├── watermark.ts … 透かし処理
    ├── pricing.ts   … 料金計算(パック料金の自動最適化)
    ├── payments.ts  … Stripe(キー未設定時はデモ決済)
    └── store.ts     … ファイルベースのジョブストア(.data/)
```

## セットアップ

```bash
npm install
cp .env.example .env.local   # APIキーを設定(下記参照)
npm run dev                  # http://localhost:3000
```

### 環境変数

| 変数 | 用途 | 未設定時 |
|---|---|---|
| `GEMINI_API_KEY` | AI画像生成([取得はこちら](https://aistudio.google.com/apikey)) | **デモモード**: 元写真の加工画像でフロー確認可 |
| `STRIPE_SECRET_KEY` | 決済([取得はこちら](https://dashboard.stripe.com/apikeys)) | **デモ決済**: 即時成功でフロー確認可 |
| `STRIPE_WEBHOOK_SECRET` | Webhook署名検証(`/api/webhook/stripe` を登録) | confirm APIによる検証のみで動作 |
| `NEXT_PUBLIC_SITE_URL` | 決済後のリダイレクト先URL | `http://localhost:3000` |
| `DATA_DIR` | 生成データ保存先 | プロジェクト直下 `.data/` |

APIキーが一切なくても起動でき、全フロー(生成→プレビュー→購入→ダウンロード)をデモモードで確認できます。

### 本番運用

```bash
npm run build
npm start
```

- 生成は数十秒かかるためバックグラウンド実行+ポーリング方式です。**常駐Nodeサーバー**(VPS / Cloud Run / Railway 等)での運用を想定しています。サーバーレス(Vercel等)で運用する場合はジョブ実行をキューワーカーに分離してください。
- `.data/` にアップロード写真・生成写真・購入記録が保存されます。スケールさせる場合は `lib/store.ts` を S3/Cloud Storage + DB に置き換えてください。
- Stripe ダッシュボードで Webhook エンドポイント `https://<ドメイン>/api/webhook/stripe`(イベント: `checkout.session.completed`)を登録し、`STRIPE_WEBHOOK_SECRET` を設定してください。

## 料金体系(変更は `lib/pricing.ts`)

| パック | 価格(税込) | 1枚あたり |
|---|---|---|
| 1枚 | ¥330 | ¥330 |
| 3枚 | ¥880 | ¥293 |
| 5枚 | ¥1,320 | ¥264 |
| 10枚 | ¥2,200 | ¥220 |

選択枚数に対して最安になるパック組合せが自動適用されます。

## シーンの追加・カスタマイズ

`lib/scenes.ts` にシーン定義(名称・説明・ベースプロンプト・バリエーション)を追加するだけで、トップページ・撮影フロー・生成処理すべてに反映されます。

## ブランド名の変更

サイト名・ロゴ・透かし・ダウンロードファイル名は **`lib/branding.ts`** に集約されています。このファイルの既定値を書き換えるか、環境変数(`NEXT_PUBLIC_BRAND_NAME` など、`.env.example` 参照)を設定するだけで全体に反映されます。
