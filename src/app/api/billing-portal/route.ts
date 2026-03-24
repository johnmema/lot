import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  })

  if (!user?.subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
