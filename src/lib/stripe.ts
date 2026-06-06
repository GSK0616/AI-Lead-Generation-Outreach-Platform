import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createSubscription({
  customerId,
  priceId,
  billingCycle = 'month',
}: {
  customerId: string;
  priceId: string;
  billingCycle?: 'month' | 'year';
}) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Subscription creation error:', error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    throw error;
  }
}

export async function updateSubscription({
  subscriptionId,
  priceId,
}: {
  subscriptionId: string;
  priceId: string;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    return updated;
  } catch (error) {
    console.error('Subscription update error:', error);
    throw error;
  }
}

export async function getCustomerInvoices(customerId: string) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 100,
    });

    return invoices.data;
  } catch (error) {
    console.error('Invoice retrieval error:', error);
    throw error;
  }
}

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  description,
}: {
  amount: number;
  currency?: string;
  customerId: string;
  description?: string;
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      description,
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
}
