import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      clerkUserId: userId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/setup?step=4`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/setup?step=3`,
  })

  return NextResponse.json({ url: session.url })
}
