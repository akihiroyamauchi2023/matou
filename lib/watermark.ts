// プレビュー用の透かし処理。
// 無料プレビューは縮小 + ブランド名の透かしタイル、購入後はオリジナルを提供する。
import sharp from 'sharp';
import { BRAND } from './branding';

const PREVIEW_MAX = 800;

export async function makeWatermarkedPreview(original: Buffer): Promise<Buffer> {
  const resized = await sharp(original)
    .resize(PREVIEW_MAX, PREVIEW_MAX, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const w = meta.width ?? PREVIEW_MAX;
  const h = meta.height ?? PREVIEW_MAX;

  // 斜めタイル状の透かしSVGを生成
  const tiles: string[] = [];
  const step = 220;
  for (let y = -h; y < h * 2; y += step) {
    for (let x = -w; x < w * 2; x += step * 1.6) {
      tiles.push(
        `<text x="${x}" y="${y}" font-family="Georgia, serif" font-size="34" fill="rgba(255,255,255,0.30)" transform="rotate(-30 ${x} ${y})">${BRAND.watermark}</text>`
      );
    }
  }
  const svg = Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${tiles.join('')}</svg>`
  );

  return sharp(resized).composite([{ input: svg, top: 0, left: 0 }]).jpeg({ quality: 80 }).toBuffer();
}
