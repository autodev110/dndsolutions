import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Exo_2, Lexend } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DnDCLI from '@/components/dnd-cli/DnDCLI'

const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-exo2' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

export const metadata: Metadata = {
  title: 'DnD Solutions',
  description:
    'DnD Solutions builds scalable digital ecosystems, blending AI automations, custom platforms, and strategic consulting.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${lexend.variable} ${exo2.variable} bg-background text-text-secondary antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 px-4 pb-16 pt-24 sm:px-8 md:px-12 lg:px-20 xl:px-32">{children}</main>
          <Footer />
        </div>
        <DnDCLI />
      </body>
    </html>
  )
}
