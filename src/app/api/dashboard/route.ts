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
  const totalRuns = await db.entryRun.count({ where: { userId: user.id } })
  const totalShows = await db.entryRun.findMany({
    where: { userId: user.id, status: "SUCCESS" },
    select: { showsEntered: true },
  })
  const totalEntries = totalShows.reduce((sum, r) => sum + r.showsEntered.length, 0)

  // Streak: count consecutive days with a successful run
  let streak = 0
  const runs = await db.entryRun.findMany({
    where: { userId: user.id, status: "SUCCESS" },
    orderBy: { runAt: "desc" },
    take: 60,
    select: { runAt: true },
  })

  if (runs.length > 0) {
    streak = 1
    for (let i = 1; i < runs.length; i++) {
      const prev = new Date(runs[i - 1].runAt)
      const curr = new Date(runs[i].runAt)
      const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 1) {
        streak++
      } else {
        break
      }
    }
  }

  return NextResponse.json({
    subscription: user.subscription
      ? { status: user.subscription.status }
      : null,
    credentials: {
      hasCredentials: !!user.credential,
      lotteryEmail: user.credential?.lotteryEmail,
    },
    recentRuns: user.entryRuns,
    stats: {
      totalEntries,
      totalWins: 0, // TODO: track wins separately when API supports it
      streak,
    },
  })
}
