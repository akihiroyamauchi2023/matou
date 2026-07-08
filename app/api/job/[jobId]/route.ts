import { NextRequest, NextResponse } from 'next/server';
import { loadJob } from '@/lib/store';
import { priceForCount } from '@/lib/pricing';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
  const job = await loadJob(params.jobId);
  if (!job) {
    return NextResponse.json({ error: 'ジョブが見つかりません' }, { status: 404 });
  }
  // クライアントに必要な情報のみ返す(downloadTokenは含めない)
  return NextResponse.json({
    id: job.id,
    sceneId: job.sceneId,
    status: job.status,
    demoGeneration: job.demoGeneration,
    photos: job.photos.map((p) => ({
      id: p.id,
      variationLabel: p.variationLabel,
      status: p.status,
      paid: job.paidPhotoIds.includes(p.id),
    })),
    pricing: {
      perPhoto: priceForCount(1),
    },
  });
}
