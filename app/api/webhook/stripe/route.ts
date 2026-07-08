import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, isDemoPayment } from '@/lib/payments';
import { markPhotosPaid } from '@/lib/store';

export const runtime = 'nodejs';

// Stripe Webhook: checkout.session.completed を受けて購入を確定する。
// (成功ページの /api/confirm と二重化しており、どちらが先でも冪等)
export async function POST(req: NextRequest) {
  if (isDemoPayment()) {
    return NextResponse.json({ received: true, demo: true });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');
  if (!secret || !signature) {
    return NextResponse.json({ error: 'webhook not configured' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const jobId = session.metadata?.jobId;
    const photoIds = (session.metadata?.photoIds ?? '').split(',').filter(Boolean);
    if (jobId && photoIds.length > 0 && session.payment_status === 'paid') {
      await markPhotosPaid(jobId, photoIds);
    }
  }

  return NextResponse.json({ received: true });
}
