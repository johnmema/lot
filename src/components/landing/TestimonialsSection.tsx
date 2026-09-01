"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    handle: "@priyanairnyc",
    photo: "/testimonials/priya.jpg",
    text: "Reported a bug with the TodayTix lottery sync on Sunday. By Monday morning it was already fixed and deployed. Open source AND responsive devs? I'm never going back to entering lotteries manually.",
    rotate: "-rotate-3",
    className: "top-[80px] left-[100px] z-[8]",
  },
  {
    name: "James Whitfield",
    handle: "@jwhitfieldnyc",
    photo: "/testimonials/james.jpg",
    text: "Upgraded to Pro this morning after winning my first lottery in the same week I signed up. The multi-account support alone is worth it — my wife and I both enter now, doubling our odds. Flawless UX.",
    rotate: "rotate-2",
    className: "top-[40px] left-[380px] z-[3]",
  },
  {
    name: "Maya Thornton",
    handle: "@mayathornton",
    photo: "/testimonials/maya.jpg",
    text: "I've been using BroadwayBot for three months and I've already won tickets to Hamilton and Wicked. A complete game-changer for a theater addict like me. Cannot recommend this enough 🎭",
    rotate: "rotate-8",
    className: "top-[40px] right-[160px] z-[8]",
  },
  {
    name: "Marcus Levy",
    handle: "@marcuslevy",
    photo: "/testimonials/marcus.jpg",
    text: "Hands down the best tool I've found for NYC theater. Uninstalled every manual reminder app I had. The show calendar integration is 🔥 — it automatically detects new lotteries when shows announce them. You guys are doing incredible work.",
    rotate: "-rotate-10",
    className: "top-[220px] left-[300px] z-[4]",
  },
  {
    name: "Derek S.",
    handle: "@derekstage",
    photo: "/testimonials/derek.jpg",
    text: "Finally something that solves the most annoying part of being a Broadway fan. Set it up in 5 minutes, now it just runs every morning. Won Wicked last week — first lottery win in two years. BroadwayBot is the real deal.",
    rotate: "-rotate-1",
    className: "top-[160px] right-[380px] z-[5]",
  },
  {
    name: "Clara Beaumont",
    handle: "@clarabeaumont",
    photo: "/testimonials/clara.jpg",
    text: "I've been searching forever for something like this. I try every major Broadway lottery daily — that used to take 30+ minutes each morning. BroadwayBot handles all of them automatically. Free tier covers everything I need. Just use it.",
    rotate: "rotate-2",
    className: "top-[220px] right-[220px] z-[7]",
  },
]

function TestimonialCard({
  name,
  handle,
  photo,
  text,
  rotate,
}: {
  name: string
  handle: string
  photo: string
  text: string
  rotate: string
}) {
  return (
    <div
      className={`${rotate} bg-white border border-[#e0e0e0] rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.05)] p-6 w-full lg:w-[300px] flex flex-col gap-4 shrink-0 transition-all duration-300 ease-out hover:rotate-0! hover:scale-105 hover:z-50! hover:shadow-[0px_12px_32px_rgba(0,0,0,0.12)] cursor-default`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={photo}
          alt={name}
          width={48}
          height={48}
          className="rounded-full border border-[#f3f4f6] object-cover w-12 h-12"
        />
        <div>
          <p className="font-medium text-[18px] leading-7 text-[#202020]">{name}</p>
          <p className="text-[14px] leading-5 text-[#838383]">{handle}</p>
        </div>
      </div>
      <p className="text-[14px] leading-[22.8px] text-[#838383]">{text}</p>
    </div>
  )
}

function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)

  function prev() {
    setCurrent((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1))
  }
  function next() {
    setCurrent((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1))
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="mt-8">
      {/* Track */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.handle} className="w-full shrink-0 px-1">
              <TestimonialCard
                name={t.name}
                handle={t.handle}
                photo={t.photo}
                text={t.text}
                rotate=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-8 h-8 rounded-full border border-[#e0e0e0] bg-white flex items-center justify-center text-[#838383] hover:text-[#202020] hover:border-[#202020] transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "w-6 bg-[#202020]" : "w-1.5 bg-[#d0d0d0]"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-8 h-8 rounded-full border border-[#e0e0e0] bg-white flex items-center justify-center text-[#838383] hover:text-[#202020] hover:border-[#202020] transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 px-6 md:px-10 bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-300 mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="font-medium text-[36px] leading-10 text-[#202020] tracking-tight">
            Loved by theater fans, trusted by daily entrants
          </h2>
        </div>
        <div className="text-center">
          <p className="text-[18px] leading-7 text-[#838383] max-w-100 mx-auto">
            Join thousands of Broadway lovers who wake up to lottery wins instead of missed entries.
          </p>
        </div>


        {/* Mobile & tablet: carousel */}
        <div className="lg:hidden">
          <TestimonialsCarousel />
        </div>

        {/* Desktop: overlapping scattered layout */}
        <div className="relative h-[560px] hidden lg:block">
          {TESTIMONIALS.map((t) => (
            <div key={t.handle} className={`absolute transition-[z-index] duration-0 ${t.className} [&:hover]:z-50`}>
              <TestimonialCard
                name={t.name}
                handle={t.handle}
                photo={t.photo}
                text={t.text}
                rotate={t.rotate}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-6 lg:mt-0">
          <Link
            href="#"
            className="bg-[#202020] text-white font-medium text-base px-6 py-3 rounded-full hover:bg-[#333] transition-[background-color] duration-200 shadow-[inset_0px_1.6px_0px_0px_rgba(255,255,255,0.2)]"
          >
            Read more winner stories
          </Link>
        </div>
      </div>
    </section>
  )
}
