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
    <nav className="relative z-50 flex justify-center pt-4 px-6 md:px-10">
      <div className="flex items-center gap-6 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
        {/* Logo inside pill */}
        <Link href="/" className="text-white font-bold text-[15px] tracking-tight pl-3">
          Playbill Picks
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5">
          <NavLink
            href="#testimonials"
            className="px-4 py-1.5 text-sm text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-[background-color,color] duration-200"
          >
            Testimonials
          </NavLink>
          <NavLink
            href="#features"
            className="px-4 py-1.5 text-sm text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-[background-color,color] duration-200"
          >
            Q&A
          </NavLink>
          <Link
            href="/pricing"
            className="px-4 py-1.5 text-sm text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-[background-color,color] duration-200"
          >
            Pricing
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-white text-[#0f172b] font-medium text-sm px-5 py-2 rounded-full hover:bg-white/90 transition-[background-color] duration-200"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-white font-medium text-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-[background-color] duration-200"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="bg-white text-[#0f172b] font-medium text-sm px-5 py-2 rounded-full hover:bg-white/90 transition-[background-color] duration-200"
            >
              Start for Free
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
        className={`md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl px-6 flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
          open ? "py-4 max-h-80 opacity-100" : "py-0 max-h-0 opacity-0"
        }`}
      >
        <NavLink
          href="#testimonials"
          className="text-[#0f172b]/70 hover:text-[#0f172b] text-sm py-1 transition-colors"
          onClick={() => setOpen(false)}
        >
          Testimonials
        </NavLink>
        <NavLink
          href="#features"
          className="text-[#0f172b]/70 hover:text-[#0f172b] text-sm py-1 transition-colors"
          onClick={() => setOpen(false)}
        >
          Q&A
        </NavLink>
        <Link
          href="/pricing"
          className="text-[#0f172b]/70 hover:text-[#0f172b] text-sm py-1 transition-colors"
          onClick={() => setOpen(false)}
        >
          Pricing
        </Link>
        <Show when="signed-in">
          <Link
            href="/dashboard"
            className="mt-2 bg-[#0f172b] text-white font-medium text-sm px-5 py-2.5 rounded-full text-center transition-colors"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
        </Show>
        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="mt-2 bg-[#0f172b] text-white font-medium text-sm px-5 py-2.5 rounded-full text-center transition-colors"
            onClick={() => setOpen(false)}
          >
            Start for Free
          </Link>
        </Show>
      </div>
    </nav>
  )
}
