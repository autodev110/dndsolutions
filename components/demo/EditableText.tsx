'use client'

import type { ElementType } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDemoEffects } from '@/lib/demo/effects'
import { cn } from '@/lib/utils'

type EditableTextProps<T extends ElementType> = {
  as?: T
  value: string
  onCommit?: (nextValue: string) => void
  className?: string
  multiline?: boolean
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'onChange'>

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim()

export default function EditableText<T extends ElementType = 'div'>(
  props: EditableTextProps<T>,
) {
  const { as, value, onCommit, className, multiline = false, ...rest } = props
  const Component = (as ?? 'div') as ElementType
  const { editModeActive, inlineEditing } = useDemoEffects((state) => state.flags)
  const isEditable = editModeActive && inlineEditing
  const [isEditing, setIsEditing] = useState(false)
  const [draftValue, setDraftValue] = useState(value)
  const originalValueRef = useRef(value)
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value)
      originalValueRef.current = value
      setIsUpdated(true)
      const timeout = window.setTimeout(() => setIsUpdated(false), 420)
      return () => window.clearTimeout(timeout)
    }
  }, [isEditing, value])

  const handleBlur = () => {
    setIsEditing(false)
    const nextValue = cleanText(draftValue)
    const original = cleanText(originalValueRef.current)
    if (nextValue && nextValue !== original) {
      onCommit?.(nextValue)
    }
  }

  const handleRevert = () => {
    setDraftValue(originalValueRef.current)
    onCommit?.(cleanText(originalValueRef.current))
    setIsEditing(false)
  }

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (!multiline && event.key === 'Enter') {
      event.preventDefault()
      ;(event.target as HTMLElement).blur()
    }
  }

  const toolbar = useMemo(() => {
    if (!isEditable || !isEditing) return null
    return (
      <div className="editable-toolbar">
        <button type="button" onClick={handleRevert}>
          Revert
        </button>
        <button type="button" onClick={handleBlur}>
          Done
        </button>
      </div>
    )
  }, [handleBlur, handleRevert, isEditable, isEditing])

  return (
    <Component
      className={cn('editable-region', className)}
      data-editing={isEditing ? 'true' : 'false'}
      {...rest}
    >
      {toolbar}
      <span
        ref={spanRef}
        contentEditable={isEditable && isEditing}
        suppressContentEditableWarning
        onClick={() => {
          if (!isEditable || isEditing) return
          setIsEditing(true)
          requestAnimationFrame(() => spanRef.current?.focus())
        }}
        onBlur={() => {
          if (!isEditable) return
          handleBlur()
        }}
        onInput={(event) => {
          if (!isEditable) return
          setDraftValue(event.currentTarget.textContent ?? '')
        }}
        onKeyDown={handleKeyDown}
        className={cn('inline-block w-full', multiline && 'whitespace-pre-wrap', isUpdated && 'demo-text-shift')}
      >
        {draftValue}
      </span>
    </Component>
  )
}
