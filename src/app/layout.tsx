import type { Metadata } from "next"
import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const sfPro = localFont({
  src: [
    { path: "../fonts/SF-Pro-Display-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sf-pro",
  display: "swap",
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
      <body className={`${sfPro.variable} antialiased bg-white p-2.5 md:p-4`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}