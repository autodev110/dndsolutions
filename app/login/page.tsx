'use client'

import { FormEvent, useState } from 'react'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'error'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('error')
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <LiquidGlass as="section" variant="panel" className="w-full max-w-lg space-y-8 p-10 text-left">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-accent">Member Access</p>
          <h1 className="font-heading text-4xl text-white">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="border border-white/10 bg-white/5 text-white placeholder:text-text-muted"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border border-white/10 bg-white/5 text-white placeholder:text-text-muted"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          {status === 'error' && (
            <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              Invalid credentials. Please check your email and password.
            </p>
          )}
        </form>
      </LiquidGlass>
    </div>
  )
}
