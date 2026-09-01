"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Shield,
  Zap,
  Ticket,
  Bell,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"
import { SAMPLE_SHOWS, getNextRunLabel } from "@/lib/constants"

const FEATURES = [
  "Auto-enter every Broadway lottery daily",
  "All shows — Broadway & Off-Broadway",
  "Daily entry confirmations",
  "Entry history & streak tracking",
  "AES-256 encrypted credentials",
  "Cancel anytime",
]

type VerifyPhase = "idle" | "connecting" | "authenticating" | "verified" | "failed"

// Step 1: Explainer
function ExplainerStep({ onContinue }: { onContinue: () => void }) {
  const steps = [
    {
      icon: LinkIcon,
      title: "Connect your Telecharge account",
      description: "Link your rush.telecharge.com login so we can enter lotteries on your behalf.",
    },
    {
      icon: Ticket,
      title: "We enter every lottery, every day",
      description: "Our system automatically submits entries for all open Broadway show lotteries.",
    },
    {
      icon: Bell,
      title: "You get notified",
      description: "You'll get a daily email confirming which lotteries we entered for you.",
    },
  ]

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <p className="text-white/40 text-xs font-medium tracking-widest uppercase text-center">
        Step 1 of 4
      </p>
      <h1 className="text-white font-medium text-[36px] leading-10 tracking-tight text-center mb-2">
        How Playbill Picks works
      </h1>
      <p className="text-white/60 text-[15px] text-center mb-10">
        Three steps to automated Broadway lottery entries.
      </p>

      <div className="space-y-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-4 flex items-start gap-4 shadow-sm"
            >
              <div className="w-9 h-9 bg-[#7a9dc2]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-[#7a9dc2]" />
              </div>
              <div>
                <p className="text-[#1d293d] text-sm font-semibold mb-0.5">
                  {i + 1}. {s.title}
                </p>
                <p className="text-[#90a1b9] text-xs leading-relaxed">{s.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 bg-[#202020] text-white font-medium text-[15px] px-6 py-3.5 rounded-full shadow-[inset_0px_1.6px_0px_0px_rgba(255,255,255,0.2)] hover:bg-[#333] hover:scale-[1.03] active:scale-[0.97] transition-[background-color,transform] duration-200"
        >
          Continue
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// Step 2: Credentials
function CredentialStep({ onComplete }: { onComplete: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [trustOpen, setTrustOpen] = useState(false)
  const [phase, setPhase] = useState<VerifyPhase>("idle")
  const [error, setError] = useState("")

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setPhase("connecting")

    // Step 1: Verify credentials first (stateless — sends creds in body)
    setPhase("authenticating")
    const testRes = await fetch("/api/credentials/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotteryEmail: email, lotteryPassword: password }),
    })
    const testData = await testRes.json().catch(() => ({}))

    if (!testRes.ok || !testData.verified) {
      setPhase("failed")
      if (testRes.status === 429) {
        setError("Too many attempts. Wait 1 minute.")
      } else {
        setError(testData.message ?? testData.error ?? "Incorrect email or password.")
      }
      return
    }

    // Step 2: Save credentials only after successful verification
    const saveRes = await fetch("/api/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotteryEmail: email, lotteryPassword: password }),
    })

    if (!saveRes.ok) {
      setPhase("failed")
      setError("Credentials verified but failed to save. Please try again.")
      return
    }

    setPhase("verified")
    setTimeout(() => onComplete(), 1200)
  }

  const trustPoints = [
    "We log in on your behalf to submit lottery entries",
    "Your password is AES-256 encrypted at rest",
    "We never change your account settings",
    "Delete your credentials anytime from the dashboard",
  ]

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <p className="text-white/40 text-xs font-medium tracking-widest uppercase text-center">
        Step 2 of 4
      </p>
      <h1 className="text-white font-medium text-[36px] leading-10 tracking-tight text-center mb-2">
        Connect your account
      </h1>
      <p className="text-white/60 text-[15px] text-center mb-10">
        Enter your{" "}
        <a
          href="https://rush.telecharge.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white/80 hover:text-white transition-colors"
        >
          rush.telecharge.com
        </a>{" "}
        login.
      </p>

      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-sm">
        {/* Telecharge branding */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#7a9dc2]/10 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={16} className="text-[#7a9dc2]" />
          </div>
          <div>
            <h2 className="text-[#0f172b] font-semibold text-sm">rush.telecharge.com</h2>
            <p className="text-[#90a1b9] text-xs">Your lottery account credentials</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="text-[#314158] text-xs font-medium block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={phase === "connecting" || phase === "authenticating" || phase === "verified"}
              className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-base text-[#0f172b] placeholder:text-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2] disabled:opacity-50"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-[#314158] text-xs font-medium block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={phase === "connecting" || phase === "authenticating" || phase === "verified"}
                className="w-full border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-base text-[#0f172b] placeholder:text-[#90a1b9] focus:outline-none focus:ring-2 focus:ring-[#7a9dc2]/30 focus:border-[#7a9dc2] pr-10 disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90a1b9] hover:text-[#62748e]"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Verification animation */}
          {phase !== "idle" && phase !== "failed" && (
            <div className="space-y-2 pt-2">
              <VerifyStep
                label="Connecting to Telecharge..."
                done={phase === "authenticating" || phase === "verified"}
                active={phase === "connecting"}
              />
              <VerifyStep
                label="Authenticating..."
                done={phase === "verified"}
                active={phase === "authenticating"}
              />
              <VerifyStep
                label="Account verified!"
                done={phase === "verified"}
                active={false}
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs flex items-center gap-1.5 pt-1">
              <AlertTriangle size={12} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={phase === "connecting" || phase === "authenticating" || phase === "verified"}
            className="w-full flex items-center justify-center gap-2 bg-[#0f172b] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1e293b] transition-colors disabled:opacity-50 mt-2"
          >
            {phase === "connecting" || phase === "authenticating" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Verifying...
              </>
            ) : phase === "verified" ? (
              <>
                <Check size={14} />
                Verified!
              </>
            ) : (
              "Save & Verify"
            )}
          </button>
        </form>

        {/* Trust section */}
        <div className="mt-4 border-t border-[#f1f5f9] pt-4">
          <button
            onClick={() => setTrustOpen(!trustOpen)}
            className="flex items-center gap-2 text-xs text-[#90a1b9] hover:text-[#62748e] transition-colors w-full"
          >
            <Shield size={12} />
            Why do we need your password?
            {trustOpen ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
          </button>
          {trustOpen && (
            <ul className="mt-3 space-y-2">
              {trustPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#62748e]">
                  <Check size={11} className="text-[#7a9dc2] mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function VerifyStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {done ? (
        <Check size={14} className="text-emerald-500 shrink-0" />
      ) : active ? (
        <Loader2 size={14} className="text-[#7a9dc2] animate-spin shrink-0" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-[#e2e8f0] shrink-0" />
      )}
      <span className={`text-xs ${done ? "text-emerald-600" : active ? "text-[#314158]" : "text-[#c2d0e0]"}`}>
        {label}
      </span>
    </div>
  )
}

// Step 3: Subscribe
function SubscribeStep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubscribe() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Something went wrong. Please try again.")
        setLoading(false)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <p className="text-white/40 text-xs font-medium tracking-widest uppercase text-center">
        Step 3 of 4
      </p>
      <h1 className="text-white font-medium text-[36px] leading-10 tracking-tight text-center mb-2">
        Subscribe to automate
      </h1>
      <p className="text-white/60 text-[15px] text-center mb-10">
        Your account is verified. Now activate daily lottery entries.
      </p>

      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 shadow-sm">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[#0f172b] font-extrabold text-5xl tracking-tight">$9</span>
          <span className="text-[#90a1b9] text-sm">/month</span>
        </div>

        <ul className="space-y-3 mb-8">
          {FEATURES.map((feat) => (
            <li key={feat} className="flex items-start gap-3">
              <Check size={16} className="text-[#7a9dc2] mt-0.5 shrink-0" />
              <span className="text-[#314158] text-sm">{feat}</span>
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1.5 mb-4">
            <AlertTriangle size={12} /> {error}
          </p>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0f172b] text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-[#1e293b] hover:scale-[1.02] active:scale-[0.98] transition-[background-color,transform,opacity] duration-200 disabled:opacity-50"
        >
          <Zap size={15} />
          {loading ? "Redirecting to Stripe..." : "Start winning — $9/mo"}
        </button>

        <p className="text-center text-[#90a1b9] text-xs mt-3">
          7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

// Step 4: Completion
function CompletionStep() {
  const router = useRouter()

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <p className="text-white/40 text-xs font-medium tracking-widest uppercase text-center">
        Step 4 of 4
      </p>
      <h1 className="text-white font-medium text-[36px] leading-10 tracking-tight text-center mb-2">
        {"You're all set!"}
      </h1>
      <p className="text-white/60 text-[15px] text-center mb-10">
        Your lottery entries are automated. Sit back and wait for wins.
      </p>

      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-sm">
        {/* Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-4 py-3">
            <Check size={15} className="text-emerald-500 shrink-0" />
            <span className="text-[#314158] text-sm font-medium">Telecharge account connected</span>
          </div>
          <div className="flex items-center gap-3 bg-[#f8fafc] rounded-xl px-4 py-3">
            <Check size={15} className="text-emerald-500 shrink-0" />
            <span className="text-[#314158] text-sm font-medium">Subscription active</span>
          </div>
        </div>

        {/* Next run countdown */}
        <div className="bg-[#7a9dc2]/5 rounded-xl px-4 py-3 mb-6">
          <p className="text-[#314158] text-sm font-semibold">
            First entries scheduled in {getNextRunLabel()}
          </p>
          <p className="text-[#90a1b9] text-xs mt-0.5">
            Daily at 2:00 PM UTC
          </p>
        </div>

        {/* Shows */}
        <p className="text-[#314158] text-xs font-semibold uppercase tracking-wider mb-3">
          Shows we&apos;re entering
        </p>
        <ul className="space-y-2 mb-6">
          {SAMPLE_SHOWS.map((show) => (
            <li key={show} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7a9dc2] shrink-0" />
              <span className="text-[#314158] text-sm">{show}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center justify-center gap-2 bg-[#0f172b] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#1e293b] hover:scale-[1.02] active:scale-[0.98] transition-[background-color,transform] duration-200"
        >
          Go to Dashboard
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

// Polling step 4: wait for Stripe webhook to confirm subscription
function ActivatingStep({ onActivated }: { onActivated: () => void }) {
  const [timedOut, setTimedOut] = useState(false)
  const [polling, setPolling] = useState(true)

  const startPolling = useCallback(() => {
    setTimedOut(false)
    setPolling(true)
  }, [])

  useEffect(() => {
    if (!polling) return
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch("/api/dashboard")
        if (res.ok) {
          const data = await res.json()
          if (data.subscription?.status === "ACTIVE") {
            clearInterval(interval)
            onActivated()
            return
          }
        }
      } catch {
        // keep polling
      }
      if (attempts >= 12) {
        clearInterval(interval)
        setPolling(false)
        setTimedOut(true)
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [onActivated, polling])

  if (timedOut) {
    return (
      <div className="w-full max-w-md mx-auto animate-fade-in-up">
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 shadow-sm text-center">
          <AlertTriangle size={28} className="text-[#ffb900] mx-auto mb-4" />
          <p className="text-[#314158] text-sm font-semibold mb-1">Taking longer than expected</p>
          <p className="text-[#90a1b9] text-xs mb-5">
            Your payment was received — activation may take a moment.
          </p>
          <div className="flex gap-3">
            <button
              onClick={startPolling}
              className="flex-1 bg-[#0f172b] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1e293b] transition-colors"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="flex-1 border border-[#e2e8f0] text-[#62748e] text-sm font-medium py-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 shadow-sm text-center">
        <Loader2 size={28} className="text-[#7a9dc2] animate-spin mx-auto mb-4" />
        <p className="text-[#314158] text-sm font-semibold mb-1">Activating your account...</p>
        <p className="text-[#90a1b9] text-xs">Confirming payment with Stripe. This takes a few seconds.</p>
      </div>
    </div>
  )
}

// Main setup wizard
function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useUser()

  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)

  // Detect the right step based on user state
  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/sign-up")
      return
    }

    async function detectStep() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error()
        const data = await res.json()

        const hasCredentials = data.credentials?.hasCredentials
        const hasSubscription = data.subscription?.status === "ACTIVE"

        if (hasCredentials && hasSubscription) {
          router.push("/dashboard")
          return
        }

        // Check if arriving from Stripe checkout (step=4 in URL)
        const urlStep = searchParams.get("step")
        if (urlStep === "4" && hasCredentials) {
          if (hasSubscription) {
            setCurrentStep(4)
          } else {
            // Subscription not yet active — poll for webhook
            setActivating(true)
          }
          setLoading(false)
          return
        }

        if (hasCredentials && !hasSubscription) {
          setCurrentStep(3)
        } else {
          setCurrentStep(Number(urlStep) || 1)
        }
      } catch {
        setCurrentStep(1)
      }
      setLoading(false)
    }

    detectStep()
  }, [isLoaded, isSignedIn, router, searchParams])

  const handleActivated = useCallback(() => {
    setActivating(false)
    setCurrentStep(4)
  }, [])

  if (!isLoaded || loading) {
    return (
      <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] flex items-center justify-center">
        <Loader2 size={24} className="text-white animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] relative flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 md:px-20 h-[60px] shrink-0">
        {currentStep && currentStep > 1 && currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-1.5 text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <div className="w-[54px]" />
        )}

        {/* Step indicator */}
        {currentStep && !activating && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`rounded-full transition-[width,background-color] duration-200 ${
                  i === currentStep
                    ? "w-6 h-1.5 bg-white"
                    : i < currentStep
                      ? "w-1.5 h-1.5 bg-white/50"
                      : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        )}

        <Link
          href="/"
          className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors"
        >
          Playbill Picks
        </Link>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        {activating ? (
          <ActivatingStep onActivated={handleActivated} />
        ) : currentStep === 1 ? (
          <ExplainerStep onContinue={() => setCurrentStep(2)} />
        ) : currentStep === 2 ? (
          <CredentialStep onComplete={() => setCurrentStep(3)} />
        ) : currentStep === 3 ? (
          <SubscribeStep />
        ) : currentStep === 4 ? (
          <CompletionStep />
        ) : null}
      </div>
    </main>
  )
}

export default function SetupPage() {
  return (
    <Suspense>
      <SetupContent />
    </Suspense>
  )
}
