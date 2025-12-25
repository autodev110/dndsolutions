'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ChatMessage = {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

const TOKEN_LIMIT = 800

const examplePrompts = [
  'What does your Web Development & Engineering package include?',
  'Can you help my business get more leads from Google?',
  'Are you able to create a digital storefront for my business and market it?',
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

const suspiciousClientPhrases = [
  'ignore previous',
  'ignore all instructions',
  'forget these instructions',
  'system prompt',
  'prompt injection',
  'jailbreak',
  'developer mode',
  'bypass security',
  'exploit',
  'malware',
  'sql injection',
  'drop table',
]

const linkRegex = /(https?:\/\/|www\.)/i

const guardClientInput = (input: string) => {
  const normalized = input.toLowerCase()

  if (linkRegex.test(input)) {
    return 'Please remove any links from your request.'
  }

  if (suspiciousClientPhrases.some((phrase) => normalized.includes(phrase))) {
    return 'Your request appears to violate our usage policy and was blocked.'
  }

  return null
}

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const isPreviewVisible = !isOpen && isHoveringLauncher

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isThinking])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const sendPromptToAssistant = useCallback(
    async (prompt: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller
      setIsThinking(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/dnd-cli', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: prompt }),
          signal: controller.signal,
        })

        const data = await response.json()

        if (!response.ok || !data?.message) {
          const serverMessage =
            data?.error ?? 'The assistant could not respond at the moment. Please try again shortly.'

          setErrorMessage(serverMessage)
          setMessages((prev) => [
            ...prev,
            {
              id: createId(),
              role: 'system',
              content: serverMessage,
            },
          ])
          return
        }

        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: 'assistant',
            content: data.message,
          },
        ])
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }

        const networkMessage = 'We could not reach the assistant. Please check your connection and try again.'
        setErrorMessage(networkMessage)
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: 'system',
            content: networkMessage,
          },
        ])
      } finally {
        setIsThinking(false)
        abortControllerRef.current = null
      }
    },
    [],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isThinking) return

    const guardMessage = guardClientInput(trimmed)
    if (guardMessage) {
      setErrorMessage(guardMessage)
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'system',
          content: guardMessage,
        },
      ])
      return
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    await sendPromptToAssistant(trimmed)
  }

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt)
    setErrorMessage(null)
  }

  const closePanel = () => {
    setIsOpen(false)
    setIsHoveringLauncher(false)
    setErrorMessage(null)
  }

  const isTokenLimitReached = inputValue.length >= TOKEN_LIMIT

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      <div
        className="pointer-events-auto relative flex flex-col items-end"
        onMouseEnter={() => setIsHoveringLauncher(true)}
        onMouseLeave={() => setIsHoveringLauncher(false)}
      >
        <AnimatePresence>
          {isPreviewVisible && (
            <LiquidGlass
              as={motion.div}
              variant="card"
              key="dnd-cli-preview"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="dnd-cli-terminal-bg mb-4 w-80 px-5 py-5 text-left text-xs text-text-secondary shadow-xl"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">DnD CLI · preview</p>
              <p className="mt-3 font-mono text-[12px] text-text-secondary">
                &gt; Ask about services, pricing, or how we scale your business.
              </p>
              <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-text-muted">
                <ThinkingDots />
                <span>system idle · ready for input</span>
              </div>
            </LiquidGlass>
          )}
        </AnimatePresence>

        <LiquidGlass
          as={motion.button}
          variant="fab"
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-lg font-mono text-white shadow-[0_12px_30px_rgba(40,120,255,0.45)] transition-colors"
        >
          <span className="text-2xl" aria-hidden>
            &gt;_
          </span>
          <span className="sr-only">Open DnD CLI</span>
        </LiquidGlass>
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
            <div className="frosted-glass dnd-cli-terminal-bg border border-white/10 px-2 py-2 shadow-2xl" style={{ backdropFilter: 'blur(24px)' }}>
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 font-mono text-xs text-text-secondary">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(0,255,171,0.8)]" />
                    </span>
                    DnD CLI · Service Assistant
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/80 text-black transition hover:bg-accent"
                  aria-label="Close DnD CLI"
                >
                  <X className="h-4 w-4" />
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
                  <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <Textarea
                      value={inputValue}
                      maxLength={TOKEN_LIMIT}
                      onChange={(event) => {
                        setInputValue(event.target.value)
                        if (errorMessage) {
                          setErrorMessage(null)
                        }
                      }}
                      placeholder="> Ask a question about DnD Solutions…"
                      className="min-h-[90px] border border-border bg-black/40 font-mono text-sm text-white placeholder:text-text-muted"
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        type="submit"
                        size="sm"
                        className="min-w-[72px] font-mono"
                        disabled={isThinking || !inputValue.trim()}
                      >
                        {isThinking ? '…' : 'Send'}
                      </Button>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                        {inputValue.length}/{TOKEN_LIMIT} tokens
                      </p>
                    </div>
                    {isTokenLimitReached && (
                      <p className="font-mono text-[11px] text-accent">Token limit reached. Remove characters to continue typing.</p>
                    )}
                    {errorMessage && (
                      <p className="font-mono text-[11px] text-red-400">{errorMessage}</p>
                    )}
                    <p className="font-mono text-[10px] text-text-muted">
                      Experimental AI assistant — responses may contain errors. Please verify critical details.
                    </p>
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
