// 決済まわり。Stripe Checkout を使用し、キー未設定時はデモ決済で動作する。
import Stripe from 'stripe';
import { priceForCount, CURRENCY } from './pricing';
import { getScene } from './scenes';
import { BRAND } from './branding';
import type { Job } from './store';

export function isDemoPayment(): boolean {
  return !process.env.STRIPE_SECRET_KEY;
}

let stripeClient: Stripe | null = null;
export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });
  }
  return stripeClient;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

// Stripe Checkout セッションを作成し、リダイレクトURLを返す
export async function createCheckout(job: Job, photoIds: string[]): Promise<{ url: string }> {
  const amount = priceForCount(photoIds.length);
  const sceneName = getScene(job.sceneId)?.name ?? job.sceneId;

  if (isDemoPayment()) {
    // デモ決済: Stripe未設定でもE2Eで確認できるよう、成功ページへ直接遷移。
    // 実際の支払い確定は /api/confirm (demo=1) で行う。
    const params = new URLSearchParams({
      jobId: job.id,
      photoIds: photoIds.join(','),
      demo: '1',
    });
    return { url: `${siteUrl()}/success?${params.toString()}` };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          unit_amount: amount,
          product_data: {
            name: `${BRAND.name} - ${sceneName} 高解像度ダウンロード (${photoIds.length}枚)`,
            description: '透かしなし高解像度写真のダウンロード権',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: job.id,
      photoIds: photoIds.join(','),
    },
    success_url: `${siteUrl()}/success?jobId=${job.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/gallery/${job.id}?canceled=1`,
  });

  if (!session.url) throw new Error('Stripe session has no URL');
  return { url: session.url };
}
