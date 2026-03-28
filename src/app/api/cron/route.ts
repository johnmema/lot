import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { decrypt } from "@/lib/encryption"
import { resend } from "@/lib/resend"

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
  let emailSent = 0
  let emailFailed = 0
  let cursor: string | undefined

  const utcDate = new Date().toISOString().slice(0, 10)

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

    // Idempotency: determine UTC day boundaries for dedup check
    const now = new Date()
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const endOfDay = new Date(startOfDay)
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)

    const results = await Promise.allSettled(
      users.map(async (user) => {
        const credential = user.credential!

        // Skip if already entered today (prevents double-entry on cron retry)
        const existingRun = await db.entryRun.findFirst({
          where: {
            userId: user.id,
            runAt: { gte: startOfDay, lt: endOfDay },
          },
        })
        if (existingRun) {
          return { userId: user.id, status: "SKIPPED" as const }
        }

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

          // Send confirmation email — awaited so counts are accurate, but email
          // errors are caught here and never propagate to fail the cron entry.
          if (showsEntered.length > 0 && user.email) {
            try {
              await resend.emails.send({
                from: "Playbill Picks <entries@playbillpicks.com>",
                to: user.email,
                subject: `Entered ${showsEntered.length} lottery${showsEntered.length === 1 ? "" : "s"} today`,
                text: [
                  `Today's entries are in.`,
                  ``,
                  `We entered you in ${showsEntered.length} Broadway lottery${showsEntered.length === 1 ? "" : "s"}:`,
                  showsEntered.map((s) => `  • ${s}`).join("\n"),
                  ``,
                  `Winners are selected by each lottery. We'll keep entering every day.`,
                  ``,
                  `— Playbill Picks`,
                ].join("\n"),
                headers: {
                  "Idempotency-Key": `${user.id}-${utcDate}`,
                },
              })
              emailSent++
            } catch {
              emailFailed++
            }
          }

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
      if (result.status === "fulfilled") {
        if (result.value.status === "SUCCESS") successCount++
        else if (result.value.status === "SKIPPED") totalProcessed-- // don't count skipped
        else failCount++
      } else {
        failCount++
      }
    }
  }

  return NextResponse.json({
    processed: totalProcessed,
    success: successCount,
    failed: failCount,
    emailSent,
    emailFailed,
  })
}
