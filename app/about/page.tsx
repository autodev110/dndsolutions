import Image from 'next/image'

const founders = [
  {
    name: 'Dan Nikiforov',
    role: 'Systems Architect & Engineer',
    bio: 'Architects modular infrastructures, AI automations, and data ecosystems that scale with clients.',
    image: '/founder-1.svg',
  },
  {
    name: 'Dominic Julian',
    role: 'Acquisitions & Growth Strategist',
    bio: 'Shapes the growth strategy, and cross-channel storytelling for every build.',
    image: '/founder-2.svg',
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <h1 className="font-heading text-5xl text-white">About DnD Solutions</h1>
        <p className="text-lg text-text-secondary">Two founders, one obsession: curate digital systems that feel futuristic, perform flawlessly, and grow businesses.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {founders.map((founder) => (
          <div key={founder.name} className="frosted-glass border border-white/10 p-6">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl">
              <Image src={founder.image} alt={founder.name} fill className="object-cover" />
            </div>
            <h3 className="mt-6 font-heading text-3xl text-white">{founder.name}</h3>
            <p className="text-sm uppercase tracking-[0.4em] text-accent">{founder.role}</p>
            <p className="mt-4 text-sm text-text-secondary">{founder.bio}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="font-heading text-3xl text-white">Our Story</h2>
        <p className="text-text-secondary">
          DnD Solutions was born from curating better workflows for clients frustrated with clunky tech stacks. We started as builders who fixed broken sites, patched together CRMs, and streamlined launch checklists. Quickly the work evolved—clients asked for unified dashboards, faster reviews, and AI-powered routines.
        </p>
        <p className="text-text-secondary">
          Today we choreograph full-scale systems: digital audits, SEO flywheels, social automations, backend platforms, and optimization labs. Every engagement is a curated experience with a single mission—move the metrics that matter.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_0_40px_rgba(0,169,255,0.15)]">
        <h2 className="font-heading text-3xl text-white">Our Mission</h2>
        <blockquote className="mx-auto mt-6 max-w-3xl text-2xl text-white">
          “We build digital systems that don’t just look good — they perform, scale, and evolve with your business.”
        </blockquote>
      </section>
    </div>
  )
}
