import type { DemoCardData } from './demoData'
import { demoCards } from './demoData'

export type DemoCardContent = Pick<DemoCardData, 'id' | 'title' | 'subtitle' | 'badge' | 'tags' | 'iconKey'>

export type DemoContent = {
  hero: {
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  demos: {
    sectionTitle: string
    sectionSubtitle: string
    cards: DemoCardContent[]
  }
  cta: {
    primary: string
    secondary: string
  }
}

export const DEFAULT_CONTENT: DemoContent = {
  hero: {
    title: 'We Build Scalable Digital Systems.',
    subtitle:
      'From advertising & SEO to enterprise-grade software, we design, build, and automate systems that grow and scale your business.',
    ctaPrimary: 'Start Your Project',
    ctaSecondary: 'See Examples',
  },
  demos: {
    sectionTitle: 'Demo platform, engineered for control',
    sectionSubtitle:
      'Customize this site in real time - these showcases highlight our configurable design system and elegant UX.',
    cards: demoCards.map((card) => ({
      id: card.id,
      title: card.title,
      subtitle: card.subtitle,
      badge: card.badge,
      tags: card.tags,
      iconKey: card.iconKey,
    })),
  },
  cta: {
    primary: 'Start a Project',
    secondary: 'Explore Resources',
  },
}
