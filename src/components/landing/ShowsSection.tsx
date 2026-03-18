import { Ticket, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

const SHOWS = [
  { name: "Hamilton", theatre: "Richard Rodgers", time: "7:00 PM", color: "from-[#1a1a2e] to-[#16213e]", badge: "Hot" },
  { name: "Wicked", theatre: "Gershwin Theatre", time: "7:30 PM", color: "from-[#1b4332] to-[#2d6a4f]" },
  { name: "The Lion King", theatre: "Minskoff Theatre", time: "8:00 PM", color: "from-[#7f5539] to-[#b08968]", badge: "Popular" },
  { name: "Chicago", theatre: "Ambassador Theatre", time: "7:00 PM", color: "from-[#212529] to-[#495057]" },
  { name: "Hadestown", theatre: "Walter Kerr Theatre", time: "8:00 PM", color: "from-[#3c096c] to-[#5a189a]" },
  { name: "Moulin Rouge!", theatre: "Al Hirschfeld", time: "7:00 PM", color: "from-[#6a040f] to-[#9d0208]", badge: "Closing soon" },
  { name: "SIX", theatre: "Lena Horne Theatre", time: "7:30 PM", color: "from-[#003566] to-[#006d77]" },
  { name: "Aladdin", theatre: "New Amsterdam", time: "7:00 PM", color: "from-[#14213d] to-[#1d3557]" },
]

function ShowCard({
  name,
  theatre,
  time,
  color,
  badge,
}: {
  name: string
  theatre: string
  time: string
  color: string
  badge?: string
}) {
  return (
    <div className="group relative bg-white rounded-2xl border border-[#f1f5f9] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Color header */}
      <div className={`bg-linear-to-br ${color} h-32 flex items-end p-4 relative`}>
        {badge && (
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border border-white/20">
            {badge}
          </span>
        )}
        <Ticket size={28} className="text-white/20 absolute right-4 top-4" />
        <h3 className="text-white font-bold text-lg leading-tight">{name}</h3>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#90a1b9] text-xs mb-3">{theatre}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#62748e]">
            <Clock size={13} />
            <span className="text-xs font-medium">{time}</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center group-hover:bg-[#7a9dc2] group-hover:text-white text-[#90a1b9] transition-all duration-200">
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShowsSection() {
  return (
    <section id="shows" className="py-20 px-6 md:px-10 bg-white">
      <div className="max-w-[1091px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[#7a9dc2] text-xs font-medium uppercase tracking-[1.5px] mb-3">
              Open Lotteries
            </p>
            <h2 className="text-[#0f172b] font-extrabold text-3xl md:text-[36px] tracking-tight">
              {"Today's Shows"}
            </h2>
            <p className="text-[#90a1b9] text-sm mt-2 max-w-md">
              Every show below has an open lottery right now. We enter them all for you, every morning at 9am ET.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 bg-[#0f172b] text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#1e293b] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shrink-0 self-start md:self-auto"
          >
            Enter all lotteries
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SHOWS.map((show) => (
            <ShowCard key={show.name} {...show} />
          ))}
        </div>
      </div>
    </section>
  )
}
