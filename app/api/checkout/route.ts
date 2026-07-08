import { NextRequest, NextResponse } from 'next/server';
import { loadJob } from '@/lib/store';
import { createCheckout } from '@/lib/payments';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { jobId, photoIds } = (await req.json()) as { jobId?: string; photoIds?: string[] };
    if (!jobId || !Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json({ error: 'ダウンロードする写真を選択してください' }, { status: 400 });
    }

    const job = await loadJob(jobId);
    if (!job) return NextResponse.json({ error: 'ジョブが見つかりません' }, { status: 404 });

    // 生成完了済みの写真のみ購入可能
    const valid = new Set(job.photos.filter((p) => p.status === 'done').map((p) => p.id));
    const targets = photoIds.filter((id) => valid.has(id) && !job.paidPhotoIds.includes(id));
    if (targets.length === 0) {
      return NextResponse.json({ error: '選択された写真は購入済みか、まだ生成が完了していません' }, { status: 400 });
    }

    const { url } = await createCheckout(job, targets);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[api/checkout]', err);
    return NextResponse.json({ error: '決済の開始に失敗しました' }, { status: 500 });
  }
}
