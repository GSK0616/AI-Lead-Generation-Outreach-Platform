import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      console.log('Payment succeeded');
      break;

    case 'customer.subscription.updated':
      // Handle subscription update
      console.log('Subscription updated');
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      console.log('Subscription cancelled');
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
