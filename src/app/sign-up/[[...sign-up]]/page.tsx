import { SignUp } from "@clerk/nextjs"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <main className="min-h-[calc(100vh-1.25rem)] md:min-h-[calc(100vh-2rem)] rounded-[28px] overflow-hidden bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col items-center">
        <h1 className="font-medium text-[28px] leading-8 tracking-tight text-white mb-1 text-center">
          Create your account
        </h1>
        <p className="text-[15px] text-white/50 mb-8 text-center">
          Start winning Broadway lottery tickets.
        </p>

        <SignUp
          forceRedirectUrl="/setup"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white/90 border-white/60 rounded-xl hover:bg-white transition-colors",
              formButtonPrimary:
                "bg-[#202020] hover:bg-[#333] rounded-full text-[15px] font-medium shadow-[inset_0px_1.6px_0px_0px_rgba(255,255,255,0.2)]",
              formFieldInput:
                "bg-white/90 border-white/60 rounded-xl focus:border-white focus:ring-white/20",
              footerActionLink: "text-white/70 hover:text-white",
              formFieldLabel: "text-white/70",
              identityPreviewEditButtonIcon: "text-white/70",
            },
          }}
        />

        <Link
          href="/"
          className="mt-6 text-[14px] text-white/40 hover:text-white/70 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
