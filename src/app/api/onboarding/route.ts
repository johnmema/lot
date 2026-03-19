import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { genres, ticketCount, notificationPref } = body

  const user = await db.user.findUnique({ where: { clerkId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      genres: Array.isArray(genres) ? genres : [],
      ticketCount: typeof ticketCount === "number" ? ticketCount : null,
      notificationPref: typeof notificationPref === "string" ? notificationPref : null,
    },
  })

  return NextResponse.json({ success: true })
}
