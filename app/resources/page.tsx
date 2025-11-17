import ClientMarquee from '@/components/resources/ClientMarquee'

const caseStudies = [
  {
    client: 'Black Diamond Settlement',
    challenge: 'Fragmented workflows after closing packages.',
    solution: 'Automated GBP posts, live dashboards, and templated content ops.',
    results: '+84% review capture rate & 32% faster fulfillment.',
  },
  {
    client: 'Atlas Realty Partners',
    challenge: 'Marketing funnel stalled at nurture stage.',
    solution: 'Rebuilt CRM touchpoints, AI follow-up bots, and KPI cockpit.',
    results: '2.3x booked consultations within 60 days.',
  },
  {
    client: 'Nova Property Group',
    challenge: 'Legacy GoDaddy site could not convert mobile leads.',
    solution: 'Next.js landing system with CMS + social automation.',
    results: 'Bounce rate down 41% with 4.8% lead form conversion.',
  },
  {
    client: 'Quantum Edge Lending',
    challenge: 'Compliance-heavy document tracking slowed deals.',
    solution: 'Custom admin portal with AI doc ingestion + alerts.',
    results: 'Saved 20+ hours monthly and zero missed renewals.',
  },
]

const blogPosts = [
  { title: 'Building AI copilots for service businesses', tag: 'AI / Automations' },
  { title: 'Designing glassmorphism UI that still performs', tag: 'Design Systems' },
  { title: 'Local SEO flywheel inside GBP insights', tag: 'SEO' },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <h1 className="font-heading text-5xl text-white">Resources, Case Studies & Clients</h1>
        <p className="text-lg text-text-secondary">Proof of work, learnings, and the partners who trust us with mission-critical systems.</p>
      </header>

      <section className="space-y-6">
        <h2 className="font-heading text-3xl text-white">Trusted By</h2>
        <ClientMarquee />
      </section>

      <section className="space-y-8">
        <h2 className="font-heading text-3xl text-white">Featured Case Studies</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <div key={study.client} className="frosted-glass border border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{study.client}</p>
              <div className="mt-4 space-y-2 text-sm text-text-secondary">
                <p><span className="font-semibold text-white">Challenge:</span> {study.challenge}</p>
                <p><span className="font-semibold text-white">Solution:</span> {study.solution}</p>
                <p className="text-accent">Results: {study.results}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-heading text-3xl text-white">Our Insights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.title} className="frosted-glass border border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-accent">{post.tag}</p>
              <h3 className="mt-4 font-heading text-2xl text-white">{post.title}</h3>
              <p className="mt-3 text-sm text-text-secondary">Coming soon — industry notes, playbooks, and field reports curated by DnD.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
