import { Zap, Bell, Lock, Calendar, BarChart2, Star } from "lucide-react"

const FEATURES = [
  {
    icon: Zap,
    title: "Auto-Enter Lotteries",
    description: "Set your shows and we enter every lottery for you, automatically, every single day.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get notified the moment you win. Push alerts, email, or SMS — your choice.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "Your data stays encrypted. We never share your information with third parties.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "We track lottery windows so you never miss one. Set it once, forget it forever.",
  },
  {
    icon: BarChart2,
    title: "Win Statistics",
    description: "Track your odds, entry history, and winning streaks with detailed analytics.",
  },
  {
    icon: Star,
    title: "Priority Access",
    description: "Premium members get early access to new shows and exclusive lottery pools.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 md:px-10 bg-[#f8fafc]">
      <div className="max-w-[1091px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#7a9dc2] text-xs uppercase tracking-[1.2px] mb-3">Features</p>
          <h2 className="text-[#0f172b] font-extrabold text-3xl md:text-[36px] tracking-tight mb-3">
            Everything you need to win
          </h2>
          <p className="text-[#90a1b9] text-sm">
            We handle the tedious parts so you can focus on enjoying the show.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-[#f1f5f9] rounded-[14px] p-6"
            >
              <div className="bg-[#7a9dc2]/10 rounded-[10px] w-10 h-10 flex items-center justify-center mb-6">
                <Icon size={18} className="text-[#7a9dc2]" />
              </div>
              <h3 className="text-[#0f172b] font-semibold text-[18px] tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-[#90a1b9] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
