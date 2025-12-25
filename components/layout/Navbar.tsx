'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMotionValueEvent, useScroll, motion } from 'framer-motion'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/login', label: 'Login' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 24)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-5 z-50 flex justify-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32"
    >
      {/* Adjust top value above to tweak header vertical position */}
      <nav
        className={cn(
          'frosted-glass flex w-full max-w-6xl items-center justify-between border border-transparent px-6 py-3 text-sm transition-all duration-500',
          isScrolled && 'border border-white/20 shadow-[0_10px_80px_rgba(0,0,0,0.35)]',
        )}
        style={{ backdropFilter: 'blur(24px)' }}
      >
        <Link href="/" className="relative block h-12 w-32">
          <Image src="/dndlogo3.png" alt="DnD Solutions logo" fill className="object-contain" priority />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-text-secondary transition hover:text-white">
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Button asChild variant="secondary" className="px-4 py-2 text-xs">
            <Link href="/contact">Start</Link>
          </Button>
        </div>
      </nav>
    </motion.div>
  )
}
