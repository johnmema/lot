import { CheckCircle2 } from "lucide-react"

const FEATURES = [
  {
    title: "Auto-Enter Lotteries",
    description: "Set your shows and we enter every lottery for you, automatically, every single day.",
  },
  {
    title: "Instant Win Alerts",
    description: "Get notified the moment you win. Push alerts, email, or SMS — your choice.",
  },
  {
    title: "Secure & Private",
    description: "Your data stays encrypted. We never share your information with third parties.",
  },
  {
    title: "Smart Scheduling",
    description: "We track lottery windows so you never miss one. Set it once, forget it forever.",
  },
  {
    title: "Win Statistics",
    description: "Track your odds, entry history, and winning streaks with detailed analytics.",
  },
  {
    title: "All Shows Covered",
    description: "Broadway, Off-Broadway, and touring productions — every lottery, every day.",
  },
]

const MOCK_ENTRIES = [
  { show: "Hamilton" },
  { show: "Wicked" },
  { show: "The Lion King" },
  { show: "Chicago" },
  { show: "Hadestown" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 md:px-10 bg-[#f8fafc]">
      <div className="max-w-[1091px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[#7a9dc2] text-xs uppercase tracking-[1.2px] mb-3">How it works</p>
          <h2 className="text-[#0f172b] font-extrabold text-3xl md:text-[36px] tracking-tight max-w-[400px]">
            Everything you need to win
          </h2>
        </div>

        {/* 2-column: numbered list + showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: numbered feature list */}
          <div className="space-y-8">
            {FEATURES.map((feat, i) => (
              <div key={feat.title} className="flex gap-5">
                <span className="text-[#e2e8f0] font-extrabold text-[32px] leading-none tracking-tight shrink-0 w-10 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[#0f172b] font-semibold text-[17px] tracking-tight mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-[#90a1b9] text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: showcase card */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-[#0f172b] rounded-3xl p-8 w-full max-w-[360px] shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[1.2px] mb-1">Today&apos;s entries</p>
                  <p className="text-white font-bold text-lg">5 shows entered</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>

              {/* Show list */}
              <div className="space-y-3">
                {MOCK_ENTRIES.map(({ show }) => (
                  <div key={show} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-white text-sm font-medium">{show}</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">Entered</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <p className="text-white/30 text-xs mt-6 text-center">
                Runs daily at 9:00 AM automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
