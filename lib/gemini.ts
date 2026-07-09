// Google Gemini 画像生成 (image-to-image)。
// GEMINI_API_KEY 未設定時はデモモード(sharpによる加工画像)で動作する。
import sharp from 'sharp';

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export function isDemoGeneration(): boolean {
  return !process.env.GEMINI_API_KEY;
}

export async function generatePhoto(sourceImage: Buffer, prompt: string): Promise<Buffer> {
  if (isDemoGeneration()) {
    return demoTransform(sourceImage, prompt);
  }

  const apiKey = process.env.GEMINI_API_KEY!;
  const sourceJpeg = await sharp(sourceImage)
    .rotate() // EXIFの向きを反映
    .resize(1536, 1536, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toBuffer();

  const body = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: sourceJpeg.toString('base64') } },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  };

  // 429(レート/クォータ)・503(一時的過負荷)は指数バックオフで数回リトライする。
  // 無料枠のRPM(1分あたり回数)制限に当たっても、待って再試行すれば通ることが多い。
  let res: Response | null = null;
  let lastErrText = '';
  const MAX_ATTEMPTS = 4;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    res = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) break;

    lastErrText = await res.text().catch(() => '');
    const retryable = res.status === 429 || res.status === 503;
    if (!retryable || attempt === MAX_ATTEMPTS - 1) {
      throw new Error(`Gemini API error ${res.status}: ${lastErrText.slice(0, 300)}`);
    }
    // 20s, 40s, 60s … と待つ(無料枠のRPM回復を待つため長めに)
    const waitMs = Math.min(20000 * (attempt + 1), 60000);
    console.warn(`[gemini] ${res.status} rate-limited, retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${MAX_ATTEMPTS})`);
    await new Promise((r) => setTimeout(r, waitMs));
  }

  const json = (await res!.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string }; inline_data?: { data?: string } }> } }>;
  };

  const parts = json.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const data = part.inlineData?.data ?? part.inline_data?.data;
    if (data) {
      const img = Buffer.from(data, 'base64');
      // 高解像度JPEGに正規化
      return sharp(img).jpeg({ quality: 95 }).toBuffer();
    }
  }
  throw new Error('Gemini API returned no image');
}

// デモモード: APIキーなしでもE2Eフローを確認できるよう、
// 元写真にバリエーションごとの色調・トリミング加工を施す。
async function demoTransform(sourceImage: Buffer, prompt: string): Promise<Buffer> {
  // プロンプト文字列から擬似乱数シードを作りバリエーションを分ける
  let seed = 0;
  for (let i = 0; i < prompt.length; i++) seed = (seed * 31 + prompt.charCodeAt(i)) >>> 0;

  const base = sharp(sourceImage).rotate().resize(1200, 1500, { fit: 'cover', position: 'attention' });

  const mode = seed % 5;
  let img = base;
  if (mode === 0) img = img.tint({ r: 235, g: 240, b: 250 }).modulate({ brightness: 1.05, saturation: 0.9 });
  else if (mode === 1) img = img.modulate({ brightness: 1.08, saturation: 1.15, hue: 10 });
  else if (mode === 2) img = img.grayscale().modulate({ brightness: 1.05 });
  else if (mode === 3) img = img.tint({ r: 250, g: 240, b: 225 }).modulate({ brightness: 1.03, saturation: 0.95 });
  else img = img.modulate({ brightness: 0.95, saturation: 1.05, hue: -10 });

  const photo = await img.jpeg({ quality: 92 }).toBuffer();

  // デモであることが分かる控えめなラベルを右下に付与
  const label = Buffer.from(
    `<svg width="1200" height="1500">
      <rect x="880" y="1440" width="300" height="44" rx="6" fill="rgba(0,0,0,0.55)"/>
      <text x="1030" y="1470" font-family="sans-serif" font-size="24" fill="#fff" text-anchor="middle">DEMO GENERATION</text>
    </svg>`
  );
  return sharp(photo).composite([{ input: label, top: 0, left: 0 }]).jpeg({ quality: 92 }).toBuffer();
}
