'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const services = [
  'Consulting & Strategic Onboarding',
  'Online Presence & SEO',
  'Web Development & Engineering',
  'Social Media & Advertising',
  'Graphic Design & Branding',
  'AI Services & Integrations',
  'Business Optimization & Scaling',
]

const contactSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Enter a valid email address.'),
  company: z.string().optional(),
  services: z.array(z.string()).min(1, 'Pick at least one service.'),
  details: z.string().min(10, 'Share a few details about your project.'),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serviceSelectOpen, setServiceSelectOpen] = useState(false)
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      services: [],
      details: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setStatus('submitting')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to send')
      }

      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      console.error(error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="hello@company.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="company"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Company / Organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="services"
          control={form.control}
          render={({ field }) => {
            const selected = field.value ?? []
            const remaining = services.filter((service) => !selected.includes(service))

            const handleOpenChange = (nextState: boolean) => {
              if (remaining.length === 0) {
                setServiceSelectOpen(false)
                return
              }
              setServiceSelectOpen(nextState)
            }

            const handleValueChange = (value: string) => {
              if (!selected.includes(value)) {
                const nextSelected = [...selected, value]
                field.onChange(nextSelected)
                const optionsLeft = services.filter((service) => !nextSelected.includes(service))
                setServiceSelectOpen(optionsLeft.length > 0)
              }
            }

            return (
              <FormItem>
                <FormLabel>Service of Interest</FormLabel>
                <Select open={serviceSelectOpen && remaining.length > 0} onOpenChange={handleOpenChange} onValueChange={handleValueChange}>
                  <FormControl>
                    <SelectTrigger className="justify-between">
                      <span className="text-left text-sm text-white">Select All Applicable Categories</span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {remaining.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.map((item) => (
                    <LiquidGlass
                      as="button"
                      key={item}
                      type="button"
                      onClick={() => {
                        const nextSelected = selected.filter((value) => value !== item)
                        field.onChange(nextSelected)
                        setServiceSelectOpen(false)
                      }}
                      variant="chip"
                      className="flex items-center gap-2 px-4 py-1 text-xs text-white [--lg-radius:999px]"
                    >
                      {item}
                      <span className="text-accent-pink">×</span>
                    </LiquidGlass>
                  ))}
                  {!selected.length && <p className="text-sm text-text-muted">No services selected yet.</p>}
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          name="details"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about the outcome you want, timelines, and any links." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">We typically reply within 1 business day.</p>
          <Button type="submit" disabled={status === 'submitting'} className="min-w-[180px]">
            {status === 'submitting' ? 'Sending…' : 'Submit Inquiry'}
          </Button>
        </div>
        {status === 'success' && (
          <p className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            Message sent. We’ll reply shortly.
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-lg border border-accent-pink/40 bg-accent-pink/10 px-4 py-3 text-sm text-accent-pink">
            Something went wrong. Please try again soon.
          </p>
        )}
      </form>
    </Form>
  )
}
