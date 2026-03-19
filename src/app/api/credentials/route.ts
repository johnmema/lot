import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { encrypt } from "@/lib/encryption"

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { lotteryEmail, lotteryPassword } = await req.json()

  if (!lotteryEmail || !lotteryPassword) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  // Find the user in our DB
  let user = await db.user.findUnique({ where: { clerkId } })

  if (!user) {
    // Auto-create user on first credential save
    const { currentUser } = await import("@clerk/nextjs/server")
    const clerkUser = await currentUser()
    user = await db.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? lotteryEmail,
      },
    })
  }

  const encryptedPassword = encrypt(lotteryPassword)

  await db.lotteryCredential.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      lotteryEmail,
      encryptedPassword,
    },
    update: {
      lotteryEmail,
      encryptedPassword,
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    include: { credential: true },
  })

  if (!user?.credential) {
    return NextResponse.json({ hasCredentials: false })
  }

  return NextResponse.json({
    hasCredentials: true,
    lotteryEmail: user.credential.lotteryEmail,
  })
}
