"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Show, UserButton, useUser } from "@clerk/nextjs"
import {
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { SAMPLE_SHOWS, getNextRunLabel } from "@/lib/constants"

type EntryRun = {
  id: string
  status: "SUCCESS" | "FAILED" | "PARTIAL"
  showsEntered: string[]
  runAt: string
  error: string | null
}

type DashboardData = {
  subscription: { status: string; currentPeriodEnd: string | null } | null
  credentials: { hasCredentials: boolean; lotteryEmail?: string }
  recentRuns: EntryRun[]
  stats: { totalEntries: number; totalWins: number; streak: number }
}

function getDay() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
}
function getDate() { return new Date().getDate() }
function getMonth() {
  return new Date().toLocaleDateString("en-US", { month: "short" }).toUpperCase()
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [fetchError, setFetchError] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { isLoaded, isSignedIn } = useUser()

  // Fetch dashboard data
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    setFetchError(false)
    fetch("/api/dashboard")
      .then((res) => { if (!res.ok) throw new Error(); return res.json() })
      .then((d) => {
        // Redirect to setup if not fully set up
        const hasCredentials = d.credentials?.hasCredentials
        const isActive = d.subscription?.status === "ACTIVE"
        if (!hasCredentials || !isActive) {
          router.push("/setup")
          return
        }
        setData(d)
      })
      .catch(() => { setFetchError(true) })
  }, [refreshKey, isLoaded, isSignedIn, router])

  if (fetchError) {
    return (
      <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 max-w-sm text-center">
          <p className="text-[#1d293d] font-semibold mb-2">Couldn&apos;t load your dashboard</p>
          <p className="text-[#90a1b9] text-sm mb-4">Check your connection and try again.</p>
          <button
            onClick={() => { setFetchError(false); setRefreshKey((k) => k + 1) }}
            className="bg-[#0f172b] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#1e293b] transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] relative">
      {/* Top bar */}
      <nav className="px-8 md:px-12 py-5 flex items-center justify-between relative z-10">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Playbill Picks
        </Link>
        <Show when="signed-in">
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <UserButton />
          </div>
        </Show>
      </nav>

      <div className="flex-1 px-8 md:px-12 pt-6 md:pt-10 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Left column */}
          <div className="flex-1 flex flex-col justify-start pt-4">
            <p className="text-white/60 text-xs font-medium tracking-[1.5px] uppercase mb-4">
              {getDay()}
            </p>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-white font-extrabold text-[96px] md:text-[120px] leading-none tracking-tight">
                {getDate()}
              </span>
              <span className="text-white/40 font-bold text-[36px] md:text-[48px] leading-none tracking-tight">
                {getMonth()}
              </span>
            </div>

            <h1 className="text-white font-extrabold text-[28px] md:text-[32px] leading-[1.15] tracking-[-0.5px] mb-4 max-w-[400px]">
              Your daily show lotteries are automated
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-[400px]">
              {"Sit back — we'll apply and notify you once we've entered each one."}
            </p>
          </div>

          {/* Right column */}
          <div className="flex-1 lg:max-w-[480px] flex flex-col gap-5">

            {/* Entry history or progressive empty state */}
            {data && (
              data.recentRuns.length > 0 ? (
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#f1f5f9]">
                    <p className="text-[#314158] text-sm font-semibold">Recent entries</p>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {data.recentRuns.flatMap((run) =>
                      run.showsEntered.map((show) => ({ show, run }))
                    ).map(({ show, run }, i, arr) => (
                      <div
                        key={`${run.id}-${show}`}
                        className={`flex items-center gap-4 px-6 py-4 ${i !== arr.length - 1 ? "border-b border-[#f1f5f9]" : ""}`}
                      >
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          run.status === "SUCCESS" ? "bg-emerald-400" :
                          run.status === "FAILED" ? "bg-red-400" : "bg-[#c2d0e0]"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1d293d] text-sm font-semibold leading-tight">{show}</p>
                          <p className="text-[#90a1b9] text-sm mt-0.5">
                            {new Date(run.runAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <span className={`text-xs font-medium border rounded-full px-3 py-1 ${
                          run.status === "SUCCESS" ? "text-emerald-600 border-emerald-200" :
                          run.status === "FAILED" ? "text-red-500 border-red-200" :
                          "text-[#7a9dc2] border-[#c2d9e8]"
                        }`}>
                          {run.status === "SUCCESS" ? "Entered" : run.status === "FAILED" ? "Failed" : "Partial"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Progressive empty state */
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-sm">
                  {/* Setup timeline */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-[#314158] text-sm font-medium">Account connected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-[#314158] text-sm font-medium">Subscription active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-[#7a9dc2] shrink-0" />
                      <span className="text-[#314158] text-sm font-medium">
                        First entries in {getNextRunLabel()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#f1f5f9] pt-4">
                    <p className="text-[#314158] text-xs font-semibold uppercase tracking-wider mb-3">
                      Shows we&apos;re entering
                    </p>
                    <ul className="space-y-2">
                      {SAMPLE_SHOWS.map((show) => (
                        <li key={show} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#7a9dc2] shrink-0" />
                          <span className="text-[#314158] text-sm">{show}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
