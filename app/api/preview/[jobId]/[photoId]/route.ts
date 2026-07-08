import { NextRequest, NextResponse } from 'next/server';
import { loadJob, loadPhotoImage } from '@/lib/store';
import { makeWatermarkedPreview } from '@/lib/watermark';

export const runtime = 'nodejs';

// 無料プレビュー: 縮小 + 透かし入り画像を返す
export async function GET(_req: NextRequest, { params }: { params: { jobId: string; photoId: string } }) {
  const job = await loadJob(params.jobId);
  if (!job) return new NextResponse('not found', { status: 404 });

  const photo = job.photos.find((p) => p.id === params.photoId);
  if (!photo || photo.status !== 'done') return new NextResponse('not found', { status: 404 });

  const original = await loadPhotoImage(params.jobId, params.photoId);
  if (!original) return new NextResponse('not found', { status: 404 });

  const preview = await makeWatermarkedPreview(original);
  return new NextResponse(new Uint8Array(preview), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
