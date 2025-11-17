'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
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
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')
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

  const onSubmit = (values: ContactFormValues) => {
    console.log(values)
    setStatus('submitted')
    form.reset()
    setTimeout(() => setStatus('idle'), 3000)
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service of Interest</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (!field.value?.includes(value)) {
                    field.onChange([...(field.value ?? []), value])
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select services to add" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4 flex flex-wrap gap-2">
                {field.value?.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => field.onChange((field.value ?? []).filter((value) => value !== item))}
                    className="frosted-glass flex items-center gap-2 rounded-full px-4 py-1 text-xs text-white"
                  >
                    {item}
                    <span className="text-accent-pink">×</span>
                  </button>
                ))}
                {!field.value?.length && <p className="text-sm text-text-muted">No services selected yet.</p>}
              </div>
              <FormMessage />
            </FormItem>
          )}
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
          <Button type="submit" disabled={status === 'submitted'} className="min-w-[180px]">
            {status === 'submitted' ? 'Message Sent' : 'Submit Inquiry'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
