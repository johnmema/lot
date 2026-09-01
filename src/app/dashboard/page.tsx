"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Show, UserButton, useUser } from "@clerk/nextjs"
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Flame,
  Loader2,
  Share2,
  Star,
  Ticket,
} from "lucide-react"
import Link from "next/link"
import { SAMPLE_SHOWS } from "@/lib/constants"

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
  stats: { totalEntries: number; totalShows: number; streak: number }
}

function formatDate() {
  const now = new Date()
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function useCountdown() {
  const [label, setLabel] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    function update() {
      const now = new Date()
      const next = new Date()
      next.setUTCHours(14, 0, 0, 0)
      if (now >= next) next.setUTCDate(next.getUTCDate() + 1)
      const diffMs = next.getTime() - now.getTime()

      if (diffMs <= 0) {
        setLabel("Entries running now...")
        setIsRunning(true)
        return
      }

      setIsRunning(false)
      const h = Math.floor(diffMs / (1000 * 60 * 60))
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diffMs % (1000 * 60)) / 1000)
      if (h > 0) setLabel(`${h}h ${m}m ${s}s`)
      else if (m > 0) setLabel(`${m}m ${s}s`)
      else setLabel(`${s}s`)
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return { label, isRunning }
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
  const { isLoaded, isSignedIn, user } = useUser()
  const countdown = useCountdown()
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchDashboard = useCallback(() => {
    setFetchError(false)
    fetch("/api/dashboard")
      .then((res) => { if (!res.ok) throw new Error(); return res.json() })
      .then((d) => {
        const hasCredentials = d.credentials?.hasCredentials
        const isActive = d.subscription?.status === "ACTIVE"
        if (!hasCredentials || !isActive) {
          router.push("/setup")
          return
        }
        setData(d)
      })
      .catch(() => { setFetchError(true) })
  }, [router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    fetchDashboard()
  }, [refreshKey, isLoaded, isSignedIn, fetchDashboard])

  // Double refresh: refetch at T+0 and T+5min after cron runs
  useEffect(() => {
    if (countdown.isRunning) {
      fetchDashboard()
      refreshTimeoutRef.current = setTimeout(() => {
        fetchDashboard()
      }, 5 * 60 * 1000)
    }
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    }
  }, [countdown.isRunning, fetchDashboard])

  if (fetchError) {
    return (
      <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 max-w-sm text-center">
          <p className="text-[#0f172b] text-base font-semibold mb-2">Couldn&apos;t load your dashboard</p>
          <p className="text-[#90a1b9] text-sm mb-4">Check your connection and try again.</p>
          <button
            onClick={() => { setFetchError(false); setRefreshKey((k) => k + 1) }}
            className="bg-[#0f172b] text-white font-semibold text-sm px-5 py-3 rounded-full hover:bg-[#1e293b] hover:scale-[1.02] active:scale-[0.98] transition-[background-color,transform] duration-200"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  const firstName = user?.firstName || "there"

  return (
    <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] relative">
      {/* Top bar */}
      <nav className="px-6 md:px-10 py-4 flex items-center justify-between relative z-10">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Playbill Picks
        </Link>
        <Show when="signed-in">
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <UserButton />
          </div>
        </Show>
      </nav>

      <div className="px-6 md:px-10 pb-10 relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-white/50 text-sm mb-1">{formatDate()}</p>
            <h1 className="text-white font-bold text-2xl md:text-3xl tracking-tight">
              Hey {firstName}
            </h1>
          </div>

          {/* Stats row */}
          {data && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={14} className="text-[#7a9dc2]" />
                  <span className="text-[#90a1b9] text-xs font-medium">Entries</span>
                </div>
                <p className="text-[#0f172b] text-2xl font-bold tabular-nums">{data.stats.totalEntries}</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-[#7a9dc2]" />
                  <span className="text-[#90a1b9] text-xs font-medium">Shows</span>
                </div>
                <p className="text-[#0f172b] text-2xl font-bold tabular-nums">{data.stats.totalShows}</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={14} className="text-[#7a9dc2]" />
                  <span className="text-[#90a1b9] text-xs font-medium">Streak</span>
                </div>
                <p className="text-[#0f172b] text-2xl font-bold tabular-nums">{data.stats.streak}<span className="text-sm font-medium text-[#90a1b9] ml-0.5">d</span></p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {!data && !fetchError && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white/60 rounded-2xl px-4 py-4 animate-pulse h-22" />
                ))}
              </div>
              <div className="bg-white/60 rounded-2xl animate-pulse h-75" />
            </div>
          )}

          {/* Entry history or empty state */}
          {data && (
            data.recentRuns.length > 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-[#f1f5f9]">
                  <p className="text-[#314158] text-sm font-semibold">Recent entries</p>
                </div>
                <div className="max-h-105 overflow-y-auto">
                  {data.recentRuns.flatMap((run) =>
                    run.showsEntered.map((show) => ({ show, run }))
                  ).map(({ show, run }, i, arr) => (
                    <div
                      key={`${run.id}-${show}`}
                      className={`flex items-center gap-4 px-5 py-3.5 ${i !== arr.length - 1 ? "border-b border-[#f1f5f9]" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        run.status === "SUCCESS" ? "bg-emerald-400" :
                        run.status === "FAILED" ? "bg-red-400" : "bg-[#c2d0e0]"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0f172b] text-sm font-semibold leading-tight">{show}</p>
                        <p className="text-[#90a1b9] text-xs mt-0.5">
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
              /* Progressive empty state with live countdown */
              <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm">
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className="text-[#314158] text-sm font-medium">Account connected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className="text-[#314158] text-sm font-medium">Subscription active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-[#7a9dc2] shrink-0" />
                    <span className="text-[#314158] text-sm font-medium tabular-nums">
                      {countdown.isRunning ? "Entries running now..." : `First entries in ${countdown.label}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#f1f5f9] pt-4">
                  <p className="text-[#90a1b9] text-xs font-semibold uppercase tracking-wider mb-3">
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

          {/* Share button */}
          {data && <ShareButton />}

          {/* Settings section */}
          {data && (
            <div className="mt-6 space-y-3">
              <CredentialEditCard lotteryEmail={data.credentials.lotteryEmail} />
              <BillingButton />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareData = {
      title: "Playbill Picks",
      text: "I use this to auto-enter Broadway lotteries",
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(shareData.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="mt-4 flex items-center gap-2 text-white/60 hover:text-white/90 text-sm font-medium py-2 transition-colors duration-200"
    >
      <Share2 size={14} />
      {copied ? "Link copied!" : "Share Playbill Picks"}
    </button>
  )
}

function CredentialEditCard({ lotteryEmail }: { lotteryEmail?: string }) {
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(lotteryEmail ?? "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "verifying" | "saving" | "success" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setStatus("verifying")

    // Step 1: Verify credentials (stateless)
    const testRes = await fetch("/api/credentials/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotteryEmail: email, lotteryPassword: password }),
    })
    const testData = await testRes.json().catch(() => ({}))

    if (!testRes.ok || !testData.verified) {
      setStatus("error")
      if (testRes.status === 429) {
        setError("Too many attempts. Wait 1 minute.")
      } else {
        setError(testData.message ?? "Incorrect email or password.")
      }
      return
    }

    // Step 2: Save only after verification
    setStatus("saving")
    const saveRes = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotteryEmail: email, lotteryPassword: password }),
    })

    if (!saveRes.ok) {
      setStatus("error")
      setError("Verified but failed to save. Try again.")
      return
    }

    setStatus("success")
    setPassword("")
    setTimeout(() => { setEditing(false); setStatus("idle") }, 1500)
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#314158] text-sm font-semibold">Lottery credentials</p>
          <p className="text-[#90a1b9] text-xs mt-0.5">{lotteryEmail ?? "Not set"}</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[#7a9dc2] text-xs font-semibold hover:text-[#5a7da2] py-2 transition-colors duration-200"
          >
            Edit
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rush.telecharge.com email"
            required
            className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-base text-[#0f172b] placeholder:text-[#c2d0e0] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2]"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 pr-10 text-base text-[#0f172b] placeholder:text-[#c2d0e0] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90a1b9] hover:text-[#314158] p-1"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {status === "success" && <p className="text-emerald-600 text-xs">Credentials updated</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "verifying" || status === "saving"}
              className="bg-[#0f172b] text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-[#1e293b] hover:scale-[1.02] active:scale-[0.98] transition-[background-color,transform] duration-200 disabled:opacity-50"
            >
              {status === "verifying" ? "Verifying..." : status === "saving" ? "Saving..." : "Save & verify"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setStatus("idle"); setError(""); setPassword("") }}
              className="text-[#90a1b9] text-xs font-semibold px-4 py-2.5 hover:text-[#314158] transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function BillingButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleManageBilling() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/billing-portal", { method: "POST" })
      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Couldn't open billing. Try again.")
        setLoading(false)
      }
    } catch {
      setError("Couldn't open billing. Try again.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleManageBilling}
        disabled={loading}
        className="flex items-center gap-2 text-[#7a9dc2] hover:text-[#5a7da2] text-sm font-medium py-3 transition-colors duration-200 disabled:opacity-50"
      >
        <ExternalLink size={14} />
        {loading ? "Opening..." : "Manage subscription"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
