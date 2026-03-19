"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Music,
  Theater,
  Laugh,
  Star,
  Building2,
  Sparkles,
  Bell,
  SlidersHorizontal,
} from "lucide-react"

const GENRES = [
  { id: "musicals", label: "Musicals", icon: Music },
  { id: "plays", label: "Plays", icon: Theater },
  { id: "comedy", label: "Comedy", icon: Laugh },
  { id: "revivals", label: "Revivals", icon: Star },
  { id: "off-broadway", label: "Off-Broadway", icon: Building2 },
  { id: "everything", label: "Everything", icon: Sparkles },
]

const NOTIFICATIONS = [
  {
    id: "instant",
    label: "Instant",
    description: "Get notified the moment we apply",
    icon: Bell,
  },
  {
    id: "daily",
    label: "Daily digest",
    description: "One summary every morning",
    icon: Sparkles,
  },
  {
    id: "results",
    label: "Results only",
    description: "Only hear from us with lottery results",
    icon: SlidersHorizontal,
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [notification, setNotification] = useState<string | null>(null)
  const router = useRouter()

  function toggleGenre(id: string) {
    if (id === "everything") {
      setSelectedGenres(["everything"])
      return
    }
    setSelectedGenres((prev) => {
      const filtered = prev.filter((g) => g !== "everything")
      return filtered.includes(id)
        ? filtered.filter((g) => g !== id)
        : [...filtered, id]
    })
  }

  const canContinue =
    step === 0
      ? selectedGenres.length > 0
      : step === 1
        ? true
        : notification !== null

  return (
    <main className="min-h-screen bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] relative overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 md:px-20 h-[60px] shrink-0">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <div className="w-[54px]" />
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === step
                  ? "w-8 h-1.5 bg-white"
                  : i < step
                    ? "w-1.5 h-1.5 bg-white/60"
                    : "w-1.5 h-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => router.push("/sign-up")}
          className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          key={step}
          className="w-full max-w-[448px] text-center animate-fade-in-up"
        >
          {/* Step label */}
          <p className="text-white/50 text-xs font-medium tracking-[1.2px] uppercase mb-8">
            Step {step + 1} of 3
          </p>

          {/* Step 1: Genre selection */}
          {step === 0 && (
            <>
              <h1 className="text-white font-extrabold text-[36px] leading-[40px] tracking-[-0.9px] mb-3">
                What are you into?
              </h1>
              <p className="text-white/50 text-sm mb-10">
                {"We'll find all the lotteries that match your taste."}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {GENRES.map((genre) => {
                  const Icon = genre.icon
                  const selected = selectedGenres.includes(genre.id)
                  return (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`flex items-center gap-3 rounded-[14px] px-[17px] py-3.5 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                        selected
                          ? "bg-white border border-white shadow-sm"
                          : "bg-white/80 border border-white/60 hover:bg-white/90"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-200 ${
                          selected ? "text-[#7a9dc2]" : "text-[#62748e]"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${selected ? "text-[#1d293d]" : "text-[#62748e]"}`}
                      >
                        {genre.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Step 2: Ticket count */}
          {step === 1 && (
            <>
              <h1 className="text-white font-extrabold text-[36px] leading-[40px] tracking-[-0.9px] mb-3">
                How many tickets?
              </h1>
              <p className="text-white/50 text-sm mb-10">
                Most lotteries let you apply for 1 or 2. Bringing someone?
              </p>

              <div className="flex gap-4 justify-center">
                {([1, 2] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => setTicketCount(count)}
                    className={`w-[152px] h-[134px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                      ticketCount === count
                        ? "bg-white border border-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]"
                        : "bg-white/80 border border-white/60 hover:bg-white/90"
                    }`}
                  >
                    <span
                      className={`text-[36px] font-bold leading-[40px] transition-colors duration-200 ${ticketCount === count ? "text-[#1d293d]" : "text-[#62748e]"}`}
                    >
                      {count}
                    </span>
                    <span
                      className={`text-sm transition-colors duration-200 ${ticketCount === count ? "text-[#62748e]" : "text-[#90a1b9]"}`}
                    >
                      {count === 1 ? "Just me" : "Me + guest"}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Notification preference */}
          {step === 2 && (
            <>
              <h1 className="text-white font-extrabold text-[36px] leading-[40px] tracking-[-0.9px] mb-3">
                How should we notify you?
              </h1>
              <p className="text-white/50 text-sm mb-10">
                {"Choose how you'd like to hear about your lottery applications."}
              </p>

              <div className="flex flex-col gap-3">
                {NOTIFICATIONS.map((opt) => {
                  const Icon = opt.icon
                  const selected = notification === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setNotification(opt.id)}
                      className={`flex items-center gap-4 rounded-[14px] px-5 py-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
                        selected
                          ? "bg-white border border-white shadow-sm"
                          : "bg-white/80 border border-white/60 hover:bg-white/90"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-[#62748e]" />
                      </div>
                      <div>
                        <p className="text-[#45556c] text-sm font-semibold">
                          {opt.label}
                        </p>
                        <p className="text-[#90a1b9] text-xs">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom button */}
      <div className="flex justify-center pb-10 pt-4 shrink-0">
        <button
          onClick={() => {
            if (step < 2) {
              setStep(step + 1)
            } else {
              // Save preferences to localStorage before navigating to sign-up.
              // Dashboard reads and persists these after Clerk auth completes.
              try {
                localStorage.setItem(
                  "lot_notte_onboarding",
                  JSON.stringify({ genres: selectedGenres, ticketCount, notificationPref: notification })
                )
              } catch {
                // Private browsing or quota exceeded — proceed silently
              }
              router.push("/sign-up")
            }
          }}
          disabled={!canContinue}
          className={`flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 ${
            canContinue
              ? "bg-white text-[#0f172b] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] hover:bg-white/95 hover:scale-[1.03] active:scale-[0.97]"
              : "bg-white/15 text-white/35 cursor-not-allowed"
          }`}
        >
          {step === 2 ? "Create my account" : "Continue"}
          <ArrowRight size={15} />
        </button>
      </div>
    </main>
  )
}
