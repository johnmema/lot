"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Show, UserButton } from "@clerk/nextjs"

function NavLink({
  href,
  children,
  onClick,
  className,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (href.startsWith("#")) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
    onClick?.()
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="relative z-50 animate-fade-in-up">
      <div className="flex items-center justify-between px-6 md:px-10 h-[74px]">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Playbill Picks
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/15 border border-white/20 rounded-full px-2 py-1">
          {["Shows", "Features", "About"].map((item) => (
            <NavLink
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-1.5 text-sm text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-[background-color,transform,opacity] duration-200"
            >
              {item}
            </NavLink>
          ))}
          <Link
            href="/pricing"
            className="px-4 py-1.5 text-sm text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-[background-color,transform,opacity] duration-200"
          >
            Pricing
          </Link>
        </div>

        {/* CTA / User actions */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-white text-[#0f172b] font-semibold text-sm px-5 py-2 rounded-full hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform,opacity] duration-200"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Link
              href="/onboarding"
              className="bg-white text-[#0f172b] font-semibold text-sm px-5 py-2 rounded-full hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-[background-color,transform,opacity] duration-200"
            >
              Get started
            </Link>
          </Show>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0f172b]/95 backdrop-blur-sm border-t border-white/10 px-6 flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
          open ? "py-4 max-h-80 opacity-100" : "py-0 max-h-0 opacity-0"
        }`}
      >
        {["Shows", "Features", "About"].map((item) => (
          <NavLink
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-white/80 hover:text-white text-sm py-1 transition-colors"
            onClick={() => setOpen(false)}
          >
            {item}
          </NavLink>
        ))}
        <Link
          href="/pricing"
          className="text-white/80 hover:text-white text-sm py-1 transition-colors"
          onClick={() => setOpen(false)}
        >
          Pricing
        </Link>
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="mt-2 bg-white text-[#0f172b] font-semibold text-sm px-5 py-2.5 rounded-full text-center hover:bg-white/90 transition-colors"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
        </Show>
        <Show when="signed-out">
          <Link
            href="/onboarding"
            className="mt-2 bg-white text-[#0f172b] font-semibold text-sm px-5 py-2.5 rounded-full text-center hover:bg-white/90 transition-colors"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </Show>
      </div>
    </nav>
  )
}
