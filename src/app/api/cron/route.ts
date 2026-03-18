import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { decrypt } from "@/lib/encryption"

const BATCH_SIZE = 10

export async function GET(req: Request) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let successCount = 0
  let failCount = 0
  let totalProcessed = 0
  let cursor: string | undefined

  // Cursor-based pagination: load users in batches from DB
  while (true) {
    const users = await db.user.findMany({
      where: {
        subscription: { status: "ACTIVE" },
        credential: { isNot: null },
      },
      include: { credential: true },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    })

    if (users.length === 0) break

    cursor = users[users.length - 1].id
    totalProcessed += users.length

    const results = await Promise.allSettled(
      users.map(async (user) => {
        const credential = user.credential!

        try {
          const password = decrypt(credential.encryptedPassword)
          const res = await fetch(process.env.NOTTE_API_URL!, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NOTTE_API_KEY}`,
            },
            body: JSON.stringify({
              email: credential.lotteryEmail,
              password,
            }),
            signal: AbortSignal.timeout(60_000), // 60s timeout per call
          })

          if (!res.ok) {
            const errorText = await res.text().catch(() => "Unknown error")
            throw new Error(`API returned ${res.status}: ${errorText}`)
          }

          const data = await res.json()
          const showsEntered: string[] = data.shows_entered ?? data.showsEntered ?? []

          await db.entryRun.create({
            data: {
              userId: user.id,
              status: showsEntered.length > 0 ? "SUCCESS" : "PARTIAL",
              showsEntered,
            },
          })

          return { userId: user.id, status: "SUCCESS" }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error"

          await db.entryRun.create({
            data: {
              userId: user.id,
              status: "FAILED",
              showsEntered: [],
              error: errorMessage,
            },
          })

          return { userId: user.id, status: "FAILED", error: errorMessage }
        }
      })
    )

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.status === "SUCCESS") {
        successCount++
      } else {
        failCount++
      }
    }
  }

  return NextResponse.json({
    processed: totalProcessed,
    success: successCount,
    failed: failCount,
  })
}
