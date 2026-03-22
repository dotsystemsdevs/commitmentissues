import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Checkout unavailable.' }, { status: 500 })
  }
}
