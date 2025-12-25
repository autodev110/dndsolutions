'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  BarChart3,
  Bot,
  Compass,
  Globe,
  MonitorSmartphone,
  Palette,
  Share2,
} from 'lucide-react'
import Link from 'next/link'
import LiquidGlass from '@/components/ui/LiquidGlass'

const services = [
  {
    title: 'Consulting & Strategic Onboarding',
    description: 'Business analysis, infrastructure review, and full marketing audits to build the perfect roadmap.',
    icon: Compass,
  },
  {
    title: 'Online Presence & SEO',
    description: 'Google Business Profile management, full-spectrum SEO, analytics, and reporting.',
    icon: Globe,
  },
  {
    title: 'Web Development & Engineering',
    description: 'Full-stack platforms, custom admin dashboards, and high-performance static sites.',
    icon: MonitorSmartphone,
  },
  {
    title: 'Social Media & Advertising',
    description: 'Google & Meta ads plus done-for-you social campaigns that stay on-brand and on target.',
    icon: Share2,
  },
  {
    title: 'Graphic Design & Branding',
    description: 'Logo curation, campaign assets, and tasteful UI components to evolve your brand.',
    icon: Palette,
  },
  {
    title: 'AI Services & Integrations',
    description: 'Custom chatbots, automation pipelines, and Python tooling tailored to your ops.',
    icon: Bot,
  },
  {
    title: 'Business Optimization & Scaling',
    description: 'Analytics, full-funnel orchestration, and growth systems engineered for scale.',
    icon: BarChart3,
  },
]

export default function ServiceShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end start'] })
  const translate = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <section ref={ref} className="my-20 space-y-8">
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Solutions Lab</p>
        <h2 className="font-heading text-3xl text-white md:text-5xl">Every Growth Lever, Engineered</h2>
        <p className="text-lg text-text-secondary md:text-xl">
          Scroll through integrated systems built to scale acquisitions, conversations, and conversions.
        </p>
      </div>
      <motion.div style={{ y: translate }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <LiquidGlass
              as={motion.div}
              variant="card"
              key={service.title}
              className="flex flex-col gap-4 p-7 transition-transform duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <Icon className="h-10 w-10 text-[#00FFAB]" />
              <h3 className="font-heading text-2xl text-white">{service.title}</h3>
              <p className="text-sm text-text-secondary">{service.description}</p>
              <Link href="/contact" className="mt-auto text-sm font-semibold text-[#00FFAB] transition hover:text-accent">
                Learn More →
              </Link>
            </LiquidGlass>
          )
        })}
      </motion.div>
    </section>
  )
}
