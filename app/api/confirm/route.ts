import { NextRequest, NextResponse } from 'next/server';
import { loadJob, markPhotosPaid } from '@/lib/store';
import { getStripe, isDemoPayment } from '@/lib/payments';

export const runtime = 'nodejs';

// 決済完了の確認。成功ページから呼ばれ、購入済み写真IDとダウンロードトークンを返す。
// - Stripeモード: Checkout Session の支払い状態をAPIで検証(Webhook不達時のフォールバックも兼ねる)
// - デモモード: demo=1 で即時に支払い済みとして扱う
export async function POST(req: NextRequest) {
  try {
    const { jobId, sessionId, demo, photoIds } = (await req.json()) as {
      jobId?: string;
      sessionId?: string;
      demo?: boolean;
      photoIds?: string[];
    };
    if (!jobId) return NextResponse.json({ error: 'jobIdが必要です' }, { status: 400 });

    let job = await loadJob(jobId);
    if (!job) return NextResponse.json({ error: 'ジョブが見つかりません' }, { status: 404 });

    let paidIds: string[] = [];

    if (demo) {
      if (!isDemoPayment()) {
        return NextResponse.json({ error: 'デモ決済は無効です' }, { status: 400 });
      }
      const valid = new Set(job.photos.map((p) => p.id));
      paidIds = (photoIds ?? []).filter((id) => valid.has(id));
    } else {
      if (!sessionId) return NextResponse.json({ error: 'session_idが必要です' }, { status: 400 });
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: 'お支払いが確認できませんでした' }, { status: 402 });
      }
      if (session.metadata?.jobId !== jobId) {
        return NextResponse.json({ error: '決済情報が一致しません' }, { status: 400 });
      }
      paidIds = (session.metadata?.photoIds ?? '').split(',').filter(Boolean);
    }

    if (paidIds.length > 0) {
      job = (await markPhotosPaid(jobId, paidIds)) ?? job;
    }

    return NextResponse.json({
      paidPhotoIds: job.paidPhotoIds,
      downloadToken: job.downloadToken,
      photos: job.photos
        .filter((p) => job!.paidPhotoIds.includes(p.id))
        .map((p) => ({ id: p.id, variationLabel: p.variationLabel })),
    });
  } catch (err) {
    console.error('[api/confirm]', err);
    return NextResponse.json({ error: '決済確認に失敗しました' }, { status: 500 });
  }
}
