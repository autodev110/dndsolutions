import type { DemoContent } from './content'
import { DEFAULT_CONTENT } from './content'
import type { LayoutState } from './layout'
import { DEFAULT_LAYOUT } from './layout'
import type { GlassSettings } from './glass'
import { DEFAULT_GLASS_SETTINGS } from './glass'

export type EditModeFlags = {
  inlineEditing: boolean
  showEditableRegions: boolean
  outlineComponents: boolean
  reorderCards: boolean
  reorderSections: boolean
}

export type EditModeLogEntry = {
  id: string
  label: string
  timestamp: number
}

export type EditModeDraft = {
  content: DemoContent
  layout: LayoutState
  glass: GlassSettings
  flags: EditModeFlags
  changeLog: EditModeLogEntry[]
}

export const DEFAULT_EDIT_MODE_FLAGS: EditModeFlags = {
  inlineEditing: true,
  showEditableRegions: true,
  outlineComponents: false,
  reorderCards: false,
  reorderSections: false,
}

export const DEFAULT_EDIT_MODE_DRAFT: EditModeDraft = {
  content: DEFAULT_CONTENT,
  layout: DEFAULT_LAYOUT,
  glass: DEFAULT_GLASS_SETTINGS,
  flags: DEFAULT_EDIT_MODE_FLAGS,
  changeLog: [],
}
