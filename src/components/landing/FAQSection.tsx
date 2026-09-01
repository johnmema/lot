"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const FAQS = [
  {
    question: "What is the difference between Free and Pro?",
    answer:
      "The free tier covers all major Broadway lotteries with one account. Pro unlocks multi-account support (great for couples), priority entry scheduling, and early access to new show integrations.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Yes — BroadwayBot is free to use. You get automatic daily entries for all supported lotteries with no credit card required.",
  },
  {
    question: "Which lotteries do you support?",
    answer:
      "We support all major Broadway lottery platforms including TodayTix, Broadway Direct (Broadway Lottery), and show-specific lotteries. New shows are added automatically when they announce lottery details.",
  },
  {
    question: "How does the automatic entry work?",
    answer:
      "Once you connect your lottery accounts, BroadwayBot runs every morning before lottery deadlines. It fills in your preferences and submits entries on your behalf — no action needed from you.",
  },
  {
    question: "How is this different from entering manually?",
    answer:
      "Manual entry requires opening each app every single day and hoping you remember. BroadwayBot never misses a day, runs before you wake up, and covers every show at once — including ones you didn't know had a lottery open.",
  },
  {
    question: "What happens to my entries if I cancel Pro?",
    answer:
      "You'll drop back to the free tier automatically. Your connected accounts and preferences are preserved, and BroadwayBot keeps entering — just with a single account.",
  },
  {
    question: "Do you offer plans for couples or groups?",
    answer:
      "Yes. Pro supports multiple lottery accounts, so you and a partner can both enter simultaneously, doubling your odds. For larger groups, contact us.",
  },
  {
    question: "Is my account data secure?",
    answer:
      "Your credentials are encrypted at rest and never shared. We use OAuth where lottery platforms support it, and we never store more than what's needed to submit entries.",
  },
  {
    question: "What about GDPR / data privacy?",
    answer:
      "We comply with GDPR and CCPA. You can request a full export or deletion of your data at any time from your account settings.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-[#e0e0e0] rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-3.5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="text-[16px] leading-6 font-medium text-[#202020]">{question}</span>
        <span className="shrink-0 text-[#202020] transition-transform duration-200" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          <Plus size={18} strokeWidth={2} />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          <p className="px-6 pb-4 text-[15px] leading-6 text-[#838383]">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="py-16 px-6 md:px-10 bg-[#f2f2f2]">
      <div className="max-w-300 mx-auto">
        <h2 className="font-medium text-[36px] leading-10 text-[#202020] tracking-tight mb-10">
          Questions? We&apos;ve got answers.
        </h2>
        <div className="flex flex-col gap-2.5">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
