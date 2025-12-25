'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import ServiceShowcase from '@/components/home/ServiceShowcase'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Button } from '@/components/ui/button'

const demoBlocks = [
  {
    title: 'Admin Dashboards',
    description: 'Modular analytics, permissions, and real-time insights.',
  },
  {
    title: 'CMS Editors',
    description: 'Live editing, drag-and-drop media, and AI-driven content assists.',
  },
  {
    title: 'Landing Systems',
    description: 'Pixel-perfect hero layouts, conversions-focused components, and A/B stories.',
  },
  {
    title: 'AI Ops Tools',
    description: 'Workflow builders, data co-pilots, and automation interfaces.',
  },
]

const outcomes = [
  {
    title: 'Technical Stack View',
    bullets: ['Modern full-stack JS frameworkes with scalable, secure SQL backends', 'Automation pipelines, bots, and cross-system integrations', 'Custom dashboards, admin tools, and secure operational interfaces'],
  },
  {
    title: 'Business Impact View',
    bullets: ['Outcome-driven systems designed to support measurable growth', 'Streamlined operations across teams, tools, and workflows', 'Scalable infrastructure enabling rapid testing and iteration'],
  },
]

export default function HomePage() {
  return (
    <div className="space-y-24">
      <LiquidGlass
        as="section"
        variant="hero"
        className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-8 py-16 text-center"
        /* Adjust min-h-[75vh] / padding here to control hero height */
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,169,255,0.25),_transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-6 flex w-full justify-center px-4 sm:px-8"
        >
          <span className="relative block h-32 w-full max-w-[20rem] sm:h-36 sm:max-w-[26rem] md:h-44 md:w-[44rem] md:max-w-none">
            <Image src="/dndlogo2.png" alt="DnD Solutions logo" fill className="object-contain" priority />
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center font-heading text-4xl leading-tight text-white md:text-6xl"
        >
          We Build Scalable Digital Systems.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-text-secondary"
        >
          From advertising & SEO to enterprise-grade software, we design, build, and automate systems that grow and scale your business.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild className="w-full sm:w-auto">
            <a href="/contact">Start Your Project</a>
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <a href="#services">See Our Work</a>
          </Button>
        </motion.div>
      </LiquidGlass>

      <section className="grid gap-8 lg:grid-cols-2">
        {outcomes.map((view) => (
          <LiquidGlass key={view.title} variant="panel" className="p-9 transition-transform duration-300">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">{view.title}</p>
            <h3 className="mt-4 font-heading text-3xl text-white">{view.title === 'Technical Stack View' ? 'Engineering-first perspective' : 'Outcome-focused blueprint'}</h3>
            <ul className="mt-6 space-y-3 text-sm text-text-secondary">
              {view.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  {bullet}
                </li>
              ))}
            </ul>
          </LiquidGlass>
        ))}
      </section>

      <div id="services">
        <ServiceShowcase />
      </div>

      <section className="space-y-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Components & Demos</p>
          <h2 className="font-heading text-4xl text-white">Live systems crafted for conversions</h2>
          <p className="text-lg text-text-secondary">Tap through our modular gallery showcasing responsive components, animation micro-states, and AI copilots.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {demoBlocks.map((block, index) => (
            <LiquidGlass
              as={motion.div}
              variant="card"
              key={block.title}
              className="flex flex-col p-7 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-2xl text-white">{block.title}</h3>
                <span className="text-xs uppercase tracking-widest text-accent">Demo</span>
              </div>
              <p className="mt-4 text-sm text-text-secondary">{block.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs uppercase text-text-muted">
                <div className="rounded-lg border border-white/5 px-3 py-2 text-center">Desktop</div>
                <div className="rounded-lg border border-white/5 px-3 py-2 text-center">Mobile</div>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </section>

      <LiquidGlass as="section" variant="panel" className="p-12 text-center transition-transform duration-300">
        <h3 className="font-heading text-3xl text-white">Your Project Starts Here</h3>
        <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
          We design and build integrated systems that support real growth. Connect with us when you’re ready to operate at the next level.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild>
            <a href="/contact">Start a Project</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/resources">Explore Resources</a>
          </Button>
        </div>
      </LiquidGlass>
    </div>
  )
}
