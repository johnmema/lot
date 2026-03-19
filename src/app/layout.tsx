import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Playbill Picks — Win Broadway Tickets with One Tap",
  description:
    "Automatically enter every Broadway show lottery, every day. Never miss a chance to win.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
