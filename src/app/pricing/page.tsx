"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Zap } from "lucide-react"

const FEATURES = [
  "Auto-enter every Broadway lottery daily",
  "All shows — Broadway & Off-Broadway",
  "Instant win notifications",
  "Entry history & win statistics",
  "AES-256 encrypted credentials",
  "Cancel anytime",
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-white/50 text-xs uppercase tracking-[1.2px] mb-3">Pricing</p>
          <h1 className="text-white font-extrabold text-3xl tracking-tight mb-3">
            One plan. Everything included.
          </h1>
          <p className="text-white/50 text-sm">
            No tiers, no upsells. Just lottery entries, every day.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-8 shadow-sm animate-fade-in-up">
          {/* Price */}
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-[#0f172b] font-extrabold text-5xl tracking-tight">$9</span>
            <span className="text-[#90a1b9] text-sm">/month</span>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {FEATURES.map((feat) => (
              <li key={feat} className="flex items-start gap-3">
                <Check size={16} className="text-[#7a9dc2] mt-0.5 shrink-0" />
                <span className="text-[#314158] text-sm">{feat}</span>
              </li>
            ))}
          </ul>

          {/* Subscribe button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#0f172b] text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-[#1e293b] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            <Zap size={15} />
            {loading ? "Redirecting to Stripe..." : "Start winning — $9/mo"}
          </button>

          <p className="text-center text-[#90a1b9] text-xs mt-3">
            7-day free trial. Cancel anytime.
          </p>
        </div>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="w-full text-center text-[#90a1b9] text-xs mt-6 hover:text-[#62748e] transition-colors py-3 block"
        >
          Go back
        </button>
      </div>
    </main>
  )
}
