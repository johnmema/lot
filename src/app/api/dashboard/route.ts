import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ""

  const user = await db.user.upsert({
    where: { clerkId },
    create: { clerkId, email },
    update: {},
    include: {
      subscription: true,
      credential: true,
      entryRuns: {
        orderBy: { runAt: "desc" },
        take: 10,
      },
    },
  })

  // Calculate stats
  const successRuns = await db.entryRun.findMany({
    where: { userId: user.id, status: "SUCCESS" },
    select: { showsEntered: true, runAt: true },
  })
  const totalEntries = successRuns.reduce((sum, r) => sum + r.showsEntered.length, 0)
  const distinctShowNames = new Set(successRuns.flatMap(r => r.showsEntered))
  const totalShows = distinctShowNames.size

  // Streak: count consecutive UTC calendar days with a successful run
  let streak = 0
  const uniqueDays = [...new Set(
    successRuns.map(r => new Date(r.runAt).toISOString().slice(0, 10))
  )].sort().reverse()

  if (uniqueDays.length > 0) {
    const today = new Date()
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today)
      expected.setUTCDate(today.getUTCDate() - i)
      const expectedDay = expected.toISOString().slice(0, 10)
      if (uniqueDays[i] === expectedDay) {
        streak++
      } else if (i === 0) {
        // No run today — check if yesterday starts the streak
        const yesterday = new Date(today)
        yesterday.setUTCDate(today.getUTCDate() - 1)
        const yesterdayStr = yesterday.toISOString().slice(0, 10)
        if (uniqueDays[i] === yesterdayStr) {
          streak++
        } else {
          break
        }
      } else {
        break
      }
    }
  }

  return NextResponse.json({
    subscription: user.subscription
      ? {
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() ?? null,
        }
      : null,
    credentials: {
      hasCredentials: !!user.credential,
      lotteryEmail: user.credential?.lotteryEmail,
    },
    recentRuns: user.entryRuns,
    stats: {
      totalEntries,
      totalShows,
      streak,
    },
  })
}
