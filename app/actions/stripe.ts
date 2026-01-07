'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(
  productId: string, 
  price: number, 
  productName: string,
  stripePriceId?: string,
  stripeProductId?: string
) {
  try {
    // Use existing Stripe price if available (preserves product metadata)
    // Otherwise, create a new price_data (for backward compatibility)
    const lineItems = stripePriceId 
      ? [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: 'usd',
              product: stripeProductId || undefined,
              product_data: stripeProductId ? undefined : {
                name: productName,
              },
              unit_amount: price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?canceled=true`,
    });

    if (session.url) {
      redirect(session.url);
    }
  } catch (error: any) {
    // Next.js redirect() throws a special error that should not be caught
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

