import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { decrypt } from "@/lib/encryption"

// In-memory rate limit: max 3 requests per minute per userId.
// NOTE: Resets on cold starts (serverless). Good enough for beta — upgrade
// to Upstash Redis before launch (see TODOS.md: Redis rate limiting).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= 3) return false

  entry.count++
  return true
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!checkRateLimit(clerkId)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before testing again." },
      { status: 429 }
    )
  }

  // Accept credentials from request body (stateless verify-before-save)
  // Falls back to reading from DB for re-testing saved credentials
  const body = await req.json().catch(() => ({}))
  let email = body.lotteryEmail
  let password = body.lotteryPassword

  if (!email || !password) {
    // Fallback: read saved credentials from DB
    const user = await db.user.findUnique({
      where: { clerkId },
      include: { credential: true },
    })

    if (!user?.credential) {
      return NextResponse.json({ error: "No credentials provided or saved" }, { status: 400 })
    }

    email = user.credential.lotteryEmail
    try {
      password = decrypt(user.credential.encryptedPassword)
    } catch {
      return NextResponse.json({ error: "Failed to decrypt credentials" }, { status: 500 })
    }
  }

  try {
    const res = await fetch(process.env.NOTTE_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NOTTE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        dry_run: true, // verify credentials only — do not enter any lotteries
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (res.ok) {
      return NextResponse.json({ verified: true })
    }

    const errorText = await res.text().catch(() => "")
    return NextResponse.json({
      verified: false,
      message: res.status === 401 ? "Incorrect email or password." : "Could not connect. Try again.",
      detail: errorText,
    })
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError"
    return NextResponse.json({
      verified: false,
      message: isTimeout ? "Connection timed out. Try again." : "Could not reach the lottery site.",
    })
  }
}
