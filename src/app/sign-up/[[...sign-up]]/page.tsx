import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8]">
      <SignUp />
    </main>
  )
}
