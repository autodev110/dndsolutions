import ContactForm from '@/components/forms/ContactForm'

const steps = [
  { title: 'Discovery Call', description: 'Understand goals, budget, and timelines.' },
  { title: 'Digital Audit', description: 'Review your stack, data, and active campaigns.' },
  { title: 'Custom Build Plan', description: 'We architect roadmap, sprints, and KPIs.' },
  { title: 'Execution & Growth', description: 'Ship, iterate, and scale with ongoing optimization.' },
]

export default function ContactPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4 text-center">
        <h1 className="font-heading text-5xl text-white">Start Your Project</h1>
        <p className="text-lg text-text-secondary">Tell us about your roadmap—then we will co-build the system that gets you there.</p>
      </header>

      <section className="frosted-glass border border-white/10 p-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {steps.map((step, index) => (
            <div key={step.title} className="flex-1">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 font-heading text-xl text-accent">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm uppercase tracking-widest text-text-muted">Step {index + 1}</p>
                  <h3 className="font-heading text-2xl text-white">{step.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="frosted-glass border border-white/10 p-8">
        <ContactForm />
      </section>
    </div>
  )
}
