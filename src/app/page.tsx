import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { ShowsSection } from "@/components/landing/ShowsSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { AboutSection } from "@/components/landing/AboutSection"
import { Footer } from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <main>
      <div className="bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] min-h-screen flex flex-col">
        <Navbar />
        <Hero />
      </div>

      <ShowsSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
