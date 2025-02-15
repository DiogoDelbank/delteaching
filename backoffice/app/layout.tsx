import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bank Backoffice",
  description: "Admin dashboard for managing bank accounts and transactions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'