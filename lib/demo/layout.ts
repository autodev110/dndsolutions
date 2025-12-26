import type { CardDensity, HeroVariant, SpacingDensity } from './effects'
import { DEFAULT_CONTENT } from './content'

export type LayoutState = {
  heroVariant: HeroVariant
  spacingDensity: SpacingDensity
  cardDensity: CardDensity
  demosOrder: string[]
  sectionsOrder: string[]
}

export const DEFAULT_LAYOUT: LayoutState = {
  heroVariant: 'classic',
  spacingDensity: 'normal',
  cardDensity: 'comfortable',
  demosOrder: DEFAULT_CONTENT.demos.cards.map((card) => card.id),
  sectionsOrder: ['outcomes', 'services', 'demos', 'cta'],
}
