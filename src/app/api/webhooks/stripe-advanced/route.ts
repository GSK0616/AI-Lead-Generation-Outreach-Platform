import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  const supabase = await createServerComponentClient();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Get customer metadata
      const customer = await stripe.customers.retrieve(customerId);
      const userId = (customer as any).metadata?.user_id;

      if (userId) {
        // Update subscription status in database
        const planId = subscription.items.data[0]?.price?.id;
        const planName = (subscription.items.data[0]?.price as any)?.metadata?.plan || 'pro';

        await supabase
          .from('user_profiles')
          .update({
            subscription_plan: planName,
            subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      const userId = (customer as any).metadata?.user_id;

      if (userId) {
        await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'cancelled',
          })
          .eq('id', userId);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      const userId = (customer as any).metadata?.user_id;

      if (userId) {
        // Record billing history
        await supabase.from('billing_history').insert([
          {
            user_id: userId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'paid',
            billing_period_start: new Date(invoice.period_start * 1000).toISOString(),
            billing_period_end: new Date(invoice.period_end * 1000).toISOString(),
          },
        ]);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId);
      const userId = (customer as any).metadata?.user_id;

      if (userId) {
        // Create notification for payment failure
        await supabase.from('notifications').insert([
          {
            user_id: userId,
            type: 'payment_failed',
            title: 'Payment Failed',
            message: 'Your recent payment has failed. Please update your payment method.',
            related_id: invoice.id,
          },
        ]);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
