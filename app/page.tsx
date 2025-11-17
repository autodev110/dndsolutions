'use client'

import { motion } from 'framer-motion'
import ServiceShowcase from '@/components/home/ServiceShowcase'
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
    bullets: ['Next.js + Supabase platforms', 'Automations, bots, and pipelines', 'Observability baked into every release'],
  },
  {
    title: 'Business Impact View',
    bullets: ['Operations streamlined across teams', 'Acquisition costs reduced via attribution clarity', 'Scalable infrastructure & rapid experiments'],
  },
]

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="relative min-h-screen overflow-hidden rounded-[2.5rem] border border-white/10 px-8 py-16 text-center shadow-[0_10px_80px_rgba(12,18,35,0.6)] flex flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,169,255,0.25),_transparent_55%)]" />
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 mx-auto mb-4 max-w-xl text-sm uppercase tracking-[0.4em] text-accent">
          Future-Proof Digital Systems
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 font-heading text-4xl leading-tight text-white md:text-6xl"
        >
          DnD Solutions: We Build Scalable Digital Systems.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-text-secondary"
        >
          From custom AI pipelines to full-stack web platforms, we optimize and automate your business from X to Y.
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
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        {outcomes.map((view) => (
          <div key={view.title} className="frosted-glass border border-white/5 p-8">
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
          </div>
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
            <motion.div
              key={block.title}
              className="frosted-glass border border-white/5 p-6"
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
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-transparent via-[#111731] to-[#05070f] p-10 text-center">
        <h3 className="font-heading text-3xl text-white">Your Project Starts Here</h3>
        <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
          We orchestrate strategy, product, and automation as one system. Tap in when you are ready for a partner that codes and consults.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild>
            <a href="/contact">Start a Project</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="/resources">Explore Resources</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
