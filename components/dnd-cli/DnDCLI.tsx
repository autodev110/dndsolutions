'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

const examplePrompts = [
  'What does your Web Development & Engineering package include?',
  'Can you help my business get more leads from Google?',
  'How do your AI services and automations actually work?',
  'What would you recommend for a brand-new small business website?',
]

const initialMessages: ChatMessage[] = [
  {
    id: 'system-1',
    role: 'system',
    content:
      'Welcome to DnD CLI — your interactive guide to DnD Solutions.\nType a question or select one of the examples below to begin.',
  },
]

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const ThinkingDots = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-1', className)}>
    <span className="dnd-cli-dot-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
    <span className="dnd-cli-dot-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
    <span className="dnd-cli-dot-3 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
  </div>
)

export default function DnDCLI() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHoveringLauncher, setIsHoveringLauncher] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const isPreviewVisible = !isOpen && isHoveringLauncher

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking])

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current)
      }
    }
  }, [])

  const simulateAssistantReply = useCallback((_: string) => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current)
    }
    setIsThinking(true)

    thinkingTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content:
            'This is a placeholder response from DnD CLI.\n\nIn production, this will be powered by your secured Gemini backend, answering specifically about DnD Solutions’ services, process, and offerings.',
        },
      ])
      setIsThinking(false)
    }, 900)
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isThinking) return

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    simulateAssistantReply(trimmed)
  }

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const closePanel = () => {
    setIsOpen(false)
    setIsHoveringLauncher(false)
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      <div
        className="pointer-events-auto relative flex flex-col items-end"
        onMouseEnter={() => setIsHoveringLauncher(true)}
        onMouseLeave={() => setIsHoveringLauncher(false)}
      >
        <AnimatePresence>
          {isPreviewVisible && (
            <motion.div
              key="dnd-cli-preview"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="frosted-glass dnd-cli-terminal-bg mb-4 w-80 border border-border px-4 py-4 text-left text-xs text-text-secondary shadow-xl"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">DnD CLI · preview</p>
              <p className="mt-3 font-mono text-[12px] text-text-secondary">
                &gt; Ask about services, pricing, or how we scale your business.
              </p>
              <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-text-muted">
                <ThinkingDots />
                <span>system idle · ready for input</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-primary text-lg font-mono text-black shadow-[0_0_25px_rgba(0,255,171,0.35)] transition-colors hover:bg-primary-hover"
        >
          <span className="text-2xl text-white" aria-hidden>
            &gt;_
          </span>
          <span className="sr-only">Open DnD CLI</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dnd-cli-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed bottom-24 right-6 z-[70] w-[380px] max-w-[90vw]"
          >
            <div className="frosted-glass dnd-cli-terminal-bg border border-border shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 font-mono text-xs text-text-secondary">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(0,255,171,0.8)]" />
                    </span>
                    DnD CLI · Service Assistant
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                    scope: questions about DnD Solutions only
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/80 text-sm font-bold text-black transition hover:bg-accent"
                  aria-label="Close DnD CLI"
                >
                  ×
                </button>
              </div>

              <div className="flex max-h-[70vh] flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 font-mono text-[11px] text-text-secondary">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-text-muted">
                        <span>{message.role}</span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>
                      <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">{message.content}</pre>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex items-center gap-3 text-[11px] text-text-muted">
                      <ThinkingDots />
                      <span>assistant processing request…</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-white/10 px-5 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">example queries:</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {examplePrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleExampleClick(prompt)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary transition hover:border-accent hover:text-white"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      placeholder="> Ask a question about DnD Solutions…"
                      className="flex-1 border border-border bg-black/40 font-mono text-sm text-white placeholder:text-text-muted"
                    />
                    <Button type="submit" size="sm" className="min-w-[72px] font-mono" disabled={isThinking}>
                      {isThinking ? '…' : 'Send'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
