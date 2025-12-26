import type { DemoContent } from './content'

export const deepEqual = (a: unknown, b: unknown) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

export const mergeContent = (
  base: DemoContent,
  ...overrides: Array<Partial<DemoContent> | null | undefined>
): DemoContent => {
  const next: DemoContent = {
    hero: { ...base.hero },
    demos: {
      ...base.demos,
      cards: [...base.demos.cards],
    },
    cta: { ...base.cta },
  }

  overrides.forEach((override) => {
    if (!override) return
    if (override.hero) {
      next.hero = { ...next.hero, ...override.hero }
    }
    if (override.demos) {
      next.demos = { ...next.demos, ...override.demos }
      if (override.demos.cards) {
        next.demos.cards = override.demos.cards
      }
    }
    if (override.cta) {
      next.cta = { ...next.cta, ...override.cta }
    }
  })

  return next
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const formatClockTime = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
