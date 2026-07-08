// サービスのブランド設定。ここを書き換える(または環境変数を設定する)だけで、
// サイト名・ロゴ・透かし・ダウンロードファイル名など全体に反映される。

export const BRAND = {
  // サイト名(ヘッダーロゴ・タイトル・トップページ)
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'ハレノヒ写真館',
  // 英語表記(ヘッダーのサブテキスト・フッター)
  nameEn: process.env.NEXT_PUBLIC_BRAND_NAME_EN || 'HARENOHI PHOTO STUDIO',
  // プレビュー画像の透かし文字(半角英数字を推奨)
  watermark: process.env.NEXT_PUBLIC_BRAND_WATERMARK || 'HARENOHI',
  // ダウンロードファイル名の接頭辞(半角英数字)
  filePrefix: process.env.NEXT_PUBLIC_BRAND_FILE_PREFIX || 'harenohi',
  // キャッチコピー
  tagline: 'あなたの一枚を、一生の一枚に。',
};
