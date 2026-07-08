import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { loadJob, loadPhotoImage } from '@/lib/store';
import { getScene } from '@/lib/scenes';
import { BRAND } from '@/lib/branding';

export const runtime = 'nodejs';

// 高解像度ダウンロード: 購入済み + ダウンロードトークン必須
export async function GET(req: NextRequest, { params }: { params: { jobId: string; photoId: string } }) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const job = await loadJob(params.jobId);
  if (!job) return new NextResponse('not found', { status: 404 });

  const expected = Buffer.from(job.downloadToken);
  const actual = Buffer.from(token);
  const tokenOk = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  if (!tokenOk) {
    return new NextResponse('unauthorized', { status: 401 });
  }
  if (!job.paidPhotoIds.includes(params.photoId)) {
    return new NextResponse('この写真は未購入です', { status: 402 });
  }

  const image = await loadPhotoImage(params.jobId, params.photoId);
  if (!image) return new NextResponse('not found', { status: 404 });

  const sceneName = getScene(job.sceneId)?.nameEn.replace(/\s+/g, '-').toLowerCase() ?? 'photo';
  return new NextResponse(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${BRAND.filePrefix}-${sceneName}-${params.photoId.slice(0, 8)}.jpg"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
