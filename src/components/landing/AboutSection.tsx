import Link from "next/link"
import { Heart, Ticket } from "lucide-react"

const TEAM = [
  { initials: "SK", name: "Sarah", bio: "Saw 40+ shows last year", bg: "bg-[#7a9dc2]/15", color: "text-[#7a9dc2]" },
  { initials: "MJ", name: "Marcus", bio: "Hamilton lottery winner x3", bg: "bg-purple-100", color: "text-purple-600" },
  { initials: "PR", name: "Priya", bio: "Off-Broadway superfan", bg: "bg-amber-100", color: "text-amber-600" },
]

const STATS = [
  { value: "8,200+", label: "fans using Playbill Picks" },
  { value: "2,400+", label: "lotteries won so far" },
  { value: "35+", label: "shows we enter daily" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 md:px-10 bg-white">
      <div className="max-w-[768px] mx-auto text-center">
        {/* Label */}
        <p className="text-[#7a9dc2] text-xs uppercase tracking-[1.2px] mb-4">Our Story</p>

        <h2 className="text-[#0f172b] font-extrabold text-3xl md:text-[36px] tracking-tight mb-6">
          We just really love Broadway
        </h2>

        <p className="text-[#90a1b9] text-sm leading-relaxed mb-4 max-w-[560px] mx-auto">
          It started with a missed lottery. Then another one. And another. We kept forgetting to enter — or found out too late that our favorite show had a $30 ticket we could have won. Sound familiar?
        </p>
        <p className="text-[#90a1b9] text-sm leading-relaxed mb-8 max-w-[560px] mx-auto">
          So we built Playbill Picks. A tiny tool that enters every lottery for you, every single day. No alarms, no spreadsheets, no stress. Just more chances to see incredible shows at prices that actually make sense.
        </p>

        {/* Made with love badge */}
        <div className="inline-flex items-center gap-2 bg-[#f8fafc] border border-[#f1f5f9] rounded-full px-4 py-2 mb-10">
          <Heart size={12} className="text-[#7a9dc2]" />
          <span className="text-[#62748e] text-xs">Made with love in New York City</span>
        </div>

        {/* Team */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-[480px] mx-auto">
          {TEAM.map(({ initials, name, bio, bg, color }) => (
            <div key={name} className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[14px] py-5 px-4">
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mx-auto mb-3`}>
                <span className={`text-xs font-semibold ${color}`}>{initials}</span>
              </div>
              <p className="text-[#1d293d] font-semibold text-sm">{name}</p>
              <p className="text-[#90a1b9] text-xs mt-0.5">{bio}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 md:gap-14 mb-10">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-[#0f172b] font-bold text-2xl tracking-tight">{value}</p>
              <p className="text-[#90a1b9] text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-[#0f172b] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#1e293b] transition-colors"
        >
          <Ticket size={14} />
          Start entering lotteries
        </Link>
      </div>
    </section>
  )
}
