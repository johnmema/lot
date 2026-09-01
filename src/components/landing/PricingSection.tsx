"use client"

import { Check, Zap } from "lucide-react"
import { useState } from "react"

const FREE_FEATURES = [
  "Lottery entries once per week",
  "All Broadway & Off-Broadway shows",
  "Win notifications",
  "Entry history",
]

const PRO_FEATURES = [
  "Lottery entries every single day",
  "All Broadway & Off-Broadway shows",
  "Instant win notifications",
  "Entry history & win statistics",
  "AES-256 encrypted credentials",
  "Cancel anytime",
]

const SHOWS = [
  { name: "Hamilton", gradient: "from-[#8B6914] to-[#C4962C]" },
  { name: "Wicked", gradient: "from-[#1B5E20] to-[#4CAF50]" },
  { name: "The Lion King", gradient: "from-[#E65100] to-[#FF9800]" },
  { name: "Moulin Rouge!", gradient: "from-[#B71C1C] to-[#E53935]" },
  { name: "MJ the Musical", gradient: "from-[#1A1A1A] to-[#424242]" },
  { name: "Aladdin", gradient: "from-[#1565C0] to-[#42A5F5]" },
  { name: "Chicago", gradient: "from-[#212121] to-[#616161]" },
  { name: "Hadestown", gradient: "from-[#4A148C] to-[#7B1FA2]" },
  { name: "Back to the Future", gradient: "from-[#0D47A1] to-[#1E88E5]" },
  { name: "The Notebook", gradient: "from-[#880E4F] to-[#E91E63]" },
  { name: "The Great Gatsby", gradient: "from-[#BF8C2C] to-[#FFD54F]" },
  { name: "Swept Away", gradient: "from-[#004D40] to-[#26A69A]" },
]

function ShowPoster({ name, gradient }: { name: string; gradient: string }) {
  return (
    <div
      className={`bg-linear-to-br ${gradient} rounded-xl w-full aspect-3/4 flex items-end p-4`}
    >
      <p className="text-white font-semibold text-[15px] leading-tight drop-shadow-sm">
        {name}
      </p>
    </div>
  )
}

function ScrollingPosters() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl">
      {/* Top/bottom fade masks */}
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#f2f2f2] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#f2f2f2] to-transparent z-10 pointer-events-none" />

      <div className="overflow-hidden h-full">
        <div className="animate-scroll-up flex flex-col gap-3">
          {[...SHOWS, ...SHOWS].map((show, i) => (
            <ShowPoster key={`${show.name}-${i}`} name={show.name} gradient={show.gradient} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FreeCard() {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-2xl p-7 md:p-8 flex flex-col">
      <p className="text-[#202020] font-semibold text-lg mb-1">Free</p>
      <p className="text-[14px] text-[#838383] mb-5">
        We enter lotteries for you once a week.
      </p>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-[#202020] font-bold text-[42px] tracking-tight leading-none">$0</span>
      </div>
      <p className="text-[13px] text-[#b0b0b0] mb-6">Free forever</p>

      <ul className="space-y-3 mb-8 flex-1">
        {FREE_FEATURES.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <Check size={15} className="text-[#202020] mt-0.5 shrink-0" strokeWidth={2.5} />
            <span className="text-[14px] leading-5 text-[#505050]">{feat}</span>
          </li>
        ))}
      </ul>

      <a
        href="/sign-up"
        className="w-full flex items-center justify-center bg-[#202020] text-white font-medium text-[15px] px-6 py-3.5 rounded-full hover:bg-[#333] transition-[background-color] duration-200 shadow-[inset_0px_1.6px_0px_0px_rgba(255,255,255,0.2)]"
      >
        Get started free
      </a>
    </div>
  )
}

function ProCard() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-7 md:p-8 flex flex-col relative">
      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5b8fd4] text-white text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-1.5 rounded-full whitespace-nowrap">
        Best value
      </span>

      <p className="text-white font-semibold text-lg mb-1 mt-2">Pro</p>
      <p className="text-[14px] text-white/50 mb-5">
        We enter every lottery for you, every single day.
      </p>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-white font-bold text-[42px] tracking-tight leading-none">$9</span>
        <span className="text-white/40 text-base">/mo</span>
      </div>
      <p className="text-[13px] text-white/30 mb-6">First week free. Cancel anytime.</p>

      <ul className="space-y-3 mb-8 flex-1">
        {PRO_FEATURES.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <Check size={15} className="text-[#7a9dc2] mt-0.5 shrink-0" strokeWidth={2.5} />
            <span className="text-[14px] leading-5 text-white/60">{feat}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#5b8fd4] text-white font-medium text-[15px] px-6 py-3.5 rounded-full hover:bg-[#4a7ec3] transition-[background-color] duration-200 disabled:opacity-50"
      >
        <Zap size={15} />
        {loading ? "Redirecting…" : "Get started"}
      </button>
    </div>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 px-6 md:px-10 bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-300 mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="font-medium text-[36px] leading-10 text-[#202020] tracking-tight mb-3">
            Simple, honest pricing
          </h2>
          <p className="text-[18px] leading-7 text-[#838383]">
            Start free, upgrade when you need more. Early adopter pricing locked in forever.
          </p>
        </div>

        {/* Trust badge */}
        <div className="flex justify-center mb-10">
          <span className="inline-flex items-center gap-2 bg-white border border-[#e0e0e0] rounded-full px-5 py-2 text-[14px] font-medium text-[#202020]">
            <span>❤️</span> Trusted by 1,000+ users
          </span>
        </div>

        {/* Layout: pricing cards left, poster column right */}
        <div className="relative max-w-260 mx-auto">
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:mr-50">
            <FreeCard />
            <ProCard />
          </div>

          {/* Scrolling poster column — pinned to right, clipped to card height */}
          <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-44 overflow-hidden">
            <ScrollingPosters />
          </div>
        </div>
      </div>
    </section>
  )
}
