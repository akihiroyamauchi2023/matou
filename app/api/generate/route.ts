import { NextRequest, NextResponse } from 'next/server';
import { getScene } from '@/lib/scenes';
import { startGenerationJob } from '@/lib/generator';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const sceneId = String(form.get('sceneId') ?? '');
    const file = form.get('photo');

    const scene = getScene(sceneId);
    if (!scene) {
      return NextResponse.json({ error: 'シーンが不正です' }, { status: 400 });
    }

    // 選択されたシチュエーション(バリエーションID)を受け取る
    let variationIds: string[] = [];
    try {
      const raw = form.get('variationIds');
      variationIds = raw ? (JSON.parse(String(raw)) as string[]) : [];
    } catch {
      variationIds = [];
    }
    variationIds = variationIds.filter((id) => scene.variations.some((v) => v.id === id));
    if (variationIds.length < 1 || variationIds.length > scene.maxCount) {
      return NextResponse.json(
        { error: `シチュエーションを1〜${scene.maxCount}個選んでください` },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: '写真をアップロードしてください' }, { status: 400 });
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'JPEG / PNG / WebP 形式の画像をアップロードしてください' }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: '画像サイズは15MB以下にしてください' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const job = await startGenerationJob(sceneId, variationIds, buf, ext);

    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    console.error('[api/generate]', err);
    return NextResponse.json({ error: '生成の開始に失敗しました。時間をおいて再度お試しください。' }, { status: 500 });
  }
}
