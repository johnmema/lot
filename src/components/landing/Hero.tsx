import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"

// Floating notification badge
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
      className={`absolute bg-white/90 border border-white/60 rounded-[14px] shadow-sm px-3 py-2 flex items-center gap-2 text-xs text-[#45556c] whitespace-nowrap ${floatClass} ${className}`}
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
        <div className="max-w-[1200px] mx-auto">
          {/* Left: copy */}
          <div className="md:w-1/2 z-10 relative">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/20 border border-white/25 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse-dot" />
              <span className="text-xs text-white">Lottery entries open daily</span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up-delay-1 font-extrabold text-[52px] md:text-[72px] lg:text-[88px] leading-[1] tracking-[-2.2px] text-white mb-6">
              Win Broadway
              <br />
              <span className="text-white/50">tickets</span>
              {" "}
              <span className="text-white">with</span>
              <br />
              one tap
            </h1>

            {/* Subtext */}
            <p className="animate-fade-in-up-delay-2 text-white/65 text-base md:text-lg leading-relaxed max-w-[420px] mb-10">
              Automatically enter every Broadway show lottery, every day. Never miss a chance at unbeatable prices.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-3 mb-10">
              <Link
                href="/onboarding"
                className="flex items-center gap-2 bg-white text-[#0f172b] font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform,opacity] duration-200"
              >
                Start entering
                <ArrowRight size={15} />
              </Link>
              <button className="flex items-center gap-2 bg-white/15 border border-white/20 text-white font-medium text-sm px-6 py-3 rounded-full hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform,opacity] duration-200">
                <Play size={13} />
                How it works
              </button>
            </div>

            {/* Social proof */}
            <div className="animate-fade-in-up-delay-4 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#8ec5ff", "#5ee9b5", "#ffb86a", "#c4b4ff"].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white/40"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-white/80">
                  Joined by <span className="text-white font-medium">8,200+</span> theater fans
                </p>
                <p className="text-xs text-white/50">4.9/5</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right: image + floating badges — absolutely pinned to bottom right */}
      <div className="hidden md:block absolute bottom-0 right-[8%] lg:right-[12%]">
        <div className="relative">
          {/* Broadway signpost image */}
          <Image
            src="/broadway-signpost.png"
            alt="Broadway signpost"
            width={410}
            height={693}
            priority
            className="w-[360px] lg:w-[440px] object-contain select-none animate-fade-in-up"
          />

          {/* Floating badges - each with different float timing */}
          <Badge
            color="bg-[#00d492]"
            text="You won Hamilton!"
            className="top-[40%] left-[30%]"
            floatClass="animate-float-1"
          />
          <Badge
            color="bg-[#51a2ff]"
            text="2 tickets confirmed"
            className="top-[50%] -left-10"
            floatClass="animate-float-2"
          />
          <Badge
            color="bg-[#ffb900]"
            text="Lottery closes in 1h"
            className="top-[32%] -left-8"
            floatClass="animate-float-3"
          />
          <Badge
            color="bg-[#a684ff]"
            text="Wicked added"
            className="top-[36%] -right-4"
            floatClass="animate-float-4"
          />
          <Badge
            color="bg-[#ff637e]"
            text="48 entries today"
            className="bottom-[15%] -right-2"
            floatClass="animate-float-5"
          />

          {/* Stats card */}
          <div className="absolute bottom-[26%] -left-6 bg-white/90 border border-white/60 rounded-[14px] shadow-sm p-3 min-w-[120px] animate-float-6">
            <p className="text-[11px] text-[#90a1b9]">Lotteries entered</p>
            <p className="text-lg font-bold text-[#0f172b] tracking-tight">48.2k</p>
            <p className="text-[11px] text-[#00bc7d]">312 today</p>
          </div>
        </div>
      </div>
    </div>
  )
}
