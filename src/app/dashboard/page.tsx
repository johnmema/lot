"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Show, UserButton } from "@clerk/nextjs"
import {
  Zap,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

type CredentialStatus = {
  hasCredentials: boolean
  lotteryEmail?: string
}

type EntryRun = {
  id: string
  status: "SUCCESS" | "FAILED" | "PARTIAL"
  showsEntered: string[]
  runAt: string
  error: string | null
}

type DashboardData = {
  subscription: { status: string } | null
  credentials: CredentialStatus
  recentRuns: EntryRun[]
  stats: { totalEntries: number; totalWins: number; streak: number }
}


function CredentialSetup({ onSaved }: { onSaved: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotteryEmail: email, lotteryPassword: password }),
    })

    if (res.ok) {
      onSaved()
    } else {
      setError("Failed to save credentials. Please try again.")
    }
    setSaving(false)
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#7a9dc2]/10 rounded-xl flex items-center justify-center">
          <Shield size={18} className="text-[#7a9dc2]" />
        </div>
        <div>
          <h2 className="text-[#0f172b] font-bold text-lg">Connect your lottery account</h2>
          <p className="text-[#90a1b9] text-xs">Encrypted with AES-256</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[#314158] text-sm font-medium block mb-1.5">
            Lottery site email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm text-[#0f172b] placeholder:text-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2]"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text-[#314158] text-sm font-medium block mb-1.5">
            Lottery site password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm text-[#0f172b] placeholder:text-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2] pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90a1b9] hover:text-[#62748e]"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertTriangle size={12} /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0f172b] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#1e293b] transition-colors disabled:opacity-50"
        >
          {saving ? "Encrypting & saving..." : "Save credentials"}
        </button>
      </form>
    </div>
  )
}

function getDay() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
}

function getDate() {
  return new Date().getDate()
}

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
  const searchParams = useSearchParams()
  const showCredentials = searchParams.get("setup") === "credentials"
  const [data, setData] = useState<DashboardData | null>(null)
  const [credentialsSaved, setCredentialsSaved] = useState(!showCredentials)
  const [newsletterEmail, setNewsletterEmail] = useState("")

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
  }, [credentialsSaved])

  const needsSubscription = data && (!data.subscription || data.subscription.status !== "ACTIVE")
  const needsCredentials = data && !data.credentials.hasCredentials && !credentialsSaved

  return (
    <main className="min-h-screen bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] relative overflow-hidden">
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

      {/* Subscription gate */}
      {needsSubscription && (
        <div className="px-8 md:px-12 mb-6 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 max-w-lg flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Zap size={18} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-[#0f172b] font-bold text-base mb-1">Activate your subscription</h2>
              <p className="text-[#90a1b9] text-sm mb-3">
                Subscribe to start auto-entering lotteries every day.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-[#0f172b] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#1e293b] transition-colors"
              >
                <Zap size={14} />
                Reactivate — $9/mo
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Credential setup overlay */}
      {(needsCredentials || showCredentials) && !credentialsSaved ? (
        <div className="px-8 md:px-12 pt-10 relative z-10">
          <CredentialSetup onSaved={() => setCredentialsSaved(true)} />
        </div>
      ) : (
        /* Main dashboard content */
        <div className="flex-1 px-8 md:px-12 pt-6 md:pt-12 pb-12 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Left column: Date + messaging */}
            <div className="flex-1 flex flex-col justify-start pt-4">
              {/* Day label */}
              <p className="text-white/60 text-xs font-medium tracking-[1.5px] uppercase mb-4">
                {getDay()}
              </p>

              {/* Big date */}
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-white font-extrabold text-[96px] md:text-[120px] leading-none tracking-tight">
                  {getDate()}
                </span>
                <span className="text-white/40 font-bold text-[36px] md:text-[48px] leading-none tracking-tight">
                  {getMonth()}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-white font-extrabold text-[28px] md:text-[32px] leading-[1.15] tracking-[-0.5px] mb-4 max-w-[400px]">
                Your daily show lotteries are now automated
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-[400px] mb-12">
                {"Sit back — we'll apply and notify you once we've entered each one."}
              </p>

              {/* Newsletter */}
              <div className="max-w-[400px]">
                <p className="text-white/70 text-sm font-medium mb-3">Join our newsletter</p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 bg-white/15 border border-white/25 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                  />
                  <button className="flex items-center gap-2 bg-white text-[#0f172b] font-semibold text-sm px-5 py-3 rounded-full hover:bg-white/90 transition-colors shrink-0">
                    Subscribe
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Shows list from recent runs */}
            <div className="flex-1 lg:max-w-[520px]">
              {data?.recentRuns && data.recentRuns.length > 0 ? (
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl overflow-hidden shadow-sm">
                  <div className="max-h-[580px] overflow-y-auto">
                    {data.recentRuns.flatMap((run) =>
                      run.showsEntered.map((show) => ({ show, run }))
                    ).map(({ show, run }, i, arr) => (
                      <div
                        key={`${run.id}-${show}`}
                        className={`flex items-center gap-4 px-6 py-5 ${
                          i !== arr.length - 1 ? "border-b border-[#f1f5f9]" : ""
                        }`}
                      >
                        {/* Status dot */}
                        <div className={`w-2 h-2 rounded-full shrink-0 ${
                          run.status === "SUCCESS" ? "bg-emerald-400" :
                          run.status === "FAILED" ? "bg-red-400" : "bg-[#c2d0e0]"
                        }`} />

                        {/* Show info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1d293d] text-[15px] font-semibold leading-tight">
                            {show}
                          </p>
                          <p className="text-[#90a1b9] text-xs mt-0.5">
                            {new Date(run.runAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span className={`text-xs font-medium border rounded-full px-3 py-1 ${
                          run.status === "SUCCESS"
                            ? "text-emerald-600 border-emerald-200"
                            : run.status === "FAILED"
                              ? "text-red-500 border-red-200"
                              : "text-[#7a9dc2] border-[#c2d9e8]"
                        }`}>
                          {run.status === "SUCCESS" ? "Entered" :
                           run.status === "FAILED" ? "Failed" : "Partial"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-10 text-center">
                  <p className="text-[#90a1b9] text-sm">No entries yet.</p>
                  <p className="text-[#90a1b9] text-xs mt-1">
                    Your first run happens at 9am ET tomorrow.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
