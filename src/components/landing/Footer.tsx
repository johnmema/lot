import Link from "next/link"

const LINKS = {
  Product: ["Features", "Pricing", "Blog"],
  Company: ["About", "Careers", "Press"],
  Support: ["Help Center", "Contact", "Status"],
  Legal: ["Privacy", "Terms", "Cookies"],
}

export function Footer() {
  return (
    <footer className="bg-[#141416] px-6 md:px-10 pt-16 pb-8">
      <div className="max-w-[1091px] mx-auto">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <p className="text-white font-bold text-lg tracking-tight mb-3">Playbill Picks</p>
            <p className="text-[#90a1b9] text-sm leading-relaxed max-w-[180px]">
              Automatically enter Broadway show lotteries, every day. Never miss a chance at unbeatable prices.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p className="text-[#62748e] text-xs font-semibold uppercase tracking-[1.2px] mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[#90a1b9] text-sm hover:text-white transition-colors block py-2"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a2a2e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#62748e] text-xs">
            © 2026 Playbill Picks. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Twitter", "Instagram", "TikTok"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-[#62748e] text-xs hover:text-white transition-colors block py-2"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
