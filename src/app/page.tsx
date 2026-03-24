import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { FAQSection } from "@/components/landing/FAQSection"
import { PricingSection } from "@/components/landing/PricingSection"
import { Footer } from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <main className="flex flex-col gap-2.5 md:gap-3">
      {/* Hero card */}
      <div className="rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] flex flex-col">
        <Navbar />
        <Hero />
      </div>

      {/* Testimonials card */}
      <div className="rounded-[28px] overflow-hidden">
        <TestimonialsSection />
      </div>

      {/* FAQ card */}
      <div className="rounded-[28px] overflow-hidden">
        <FAQSection />
      </div>

      {/* Pricing card */}
      <div className="rounded-[28px] overflow-hidden">
        <PricingSection />
      </div>

      {/* Footer — full bleed, breaks out of body inset */}
      <div className="-mx-2.5 -mb-2.5 md:-mx-4 md:-mb-4">
        <Footer />
      </div>
    </main>
  )
}
