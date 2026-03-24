import Link from "next/link"
import Image from "next/image"
import { Star, Monitor } from "lucide-react"

function Badge({
  color,
  text,
  className,
  floatClass,
}: {
  color: string
  text: string
  className?: string
  floatClass?: string
}) {
  return (
    <div
      className={`absolute bg-white/90 border border-white/60 rounded-[14px] shadow-sm px-3 py-2 flex items-center gap-2 text-xs text-[#45556c] whitespace-nowrap ${floatClass ?? ""} ${className ?? ""}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
      {text}
    </div>
  )
}

export function Hero() {
  return (
    <div className="relative overflow-hidden flex-1 flex items-center">
      <div className="w-full px-6 md:px-10 pt-8 pb-16 md:pb-10">
        <div className="max-w-272.75 mx-auto">

          {/* Left: copy */}
          <div className="md:w-1/2 z-10 relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/25 rounded-full px-4 py-1.5 mb-4">
              <Star size={12} className="text-white" fill="white" />
              <span className="text-sm text-white">Broadway Lottery Automation</span>
            </div>

            {/* Headline */}
            <h1 className="font-medium text-[52px] md:text-[72px] lg:text-[88px] leading-none tracking-[-2.2px] text-white mb-6">
              Win Broadway
              <br />
              tickets with
              <br />
              one tap
            </h1>

            {/* Subtext */}
            <p className="text-white/65 text-base leading-relaxed max-w-105 mb-6">
              Automatically enter every Broadway show lottery, every day. Never miss a chance at unbeatable prices.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 bg-white text-[#0f172b] font-medium text-sm px-6 py-3 rounded-full hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform] duration-200"
              >
                <Monitor size={15} />
                Start Entering Lotteries
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 bg-[#0f172b] text-white font-medium text-sm px-6 py-3 rounded-full hover:bg-[#1e293b] hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform] duration-200"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Sub-CTA text */}
            <p className="text-white/60 text-sm italic">
              No credit card required. Free for casual lottery-goers.
            </p>
          </div>

        </div>
      </div>

      {/* Right: image + floating badges — absolutely pinned to bottom right */}
      <div className="hidden md:block absolute bottom-0 right-[8%] lg:right-[12%]">
        <div className="relative">
          <Image
            src="/broadway-signpost.png"
            alt="Broadway signpost"
            width={410}
            height={693}
            priority
            className="w-90 lg:w-110 object-contain select-none"
          />

          {/* Floating badges */}
          <Badge
            color="bg-[#ffb900]"
            text="Lottery closes in 1h"
            className="top-[38%] -left-8"
            floatClass="animate-float-1"
          />
          <Badge
            color="bg-[#51a2ff]"
            text="2 tickets confirmed"
            className="top-[50%] -left-10"
            floatClass="animate-float-2"
          />
          <Badge
            color="bg-[#a684ff]"
            text="Wicked added ✨"
            className="top-[32%] -right-4"
            floatClass="animate-float-3"
          />
          <Badge
            color="bg-[#00d492]"
            text="You won Hamilton! 🎉"
            className="top-[42%] right-[-8%]"
            floatClass="animate-float-4"
          />
          <Badge
            color="bg-[#51a2ff]"
            text="1 ticket confirmed"
            className="bottom-[22%] -right-6"
            floatClass="animate-float-5"
          />
          <Badge
            color="bg-[#ff637e]"
            text="48 entries today"
            className="bottom-[10%] -right-4"
            floatClass="animate-float-6"
          />

          {/* Stats card */}
          <div className="absolute bottom-[30%] -left-6 bg-white/90 border border-white/60 rounded-[14px] shadow-sm p-3 min-w-30 animate-float-6">
            <p className="text-[11px] text-[#90a1b9]">Lotteries entered</p>
            <p className="text-lg font-bold text-[#0f172b] tracking-tight">1.2k</p>
            <p className="text-[11px] text-[#00bc7d]">↑ 208 today</p>
          </div>
        </div>
      </div>
    </div>
  )
}