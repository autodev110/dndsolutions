import ClientMarquee from '@/components/resources/ClientMarquee'
import LiquidGlass from '@/components/ui/LiquidGlass'

const caseStudies = [
  {
    client: 'Case Study Placeholder 01',
    challenge: 'Describe a challenge here once real case studies are ready.',
    solution: 'Explain the solution once the engagement is completed.',
    results: 'Share measurable outcomes when available.',
  },
  {
    client: 'Case Study Placeholder 02',
    challenge: 'Describe a challenge here once real case studies are ready.',
    solution: 'Explain the solution once the engagement is completed.',
    results: 'Share measurable outcomes when available.',
  },
  {
    client: 'Case Study Placeholder 03',
    challenge: 'Describe a challenge here once real case studies are ready.',
    solution: 'Explain the solution once the engagement is completed.',
    results: 'Share measurable outcomes when available.',
  },
  {
    client: 'Case Study Placeholder 04',
    challenge: 'Describe a challenge here once real case studies are ready.',
    solution: 'Explain the solution once the engagement is completed.',
    results: 'Share measurable outcomes when available.',
  },
]

const blogPosts = [
  { title: 'Building AI copilots for service businesses', tag: 'AI / Automations' },
  { title: 'Designing glassmorphism UI that still performs', tag: 'Design Systems' },
  { title: 'Local SEO flywheel inside GBP insights', tag: 'SEO' },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-16 pt-16">
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
            <LiquidGlass key={study.client} variant="panel" className="p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">{study.client}</p>
              <div className="mt-4 space-y-2 text-sm text-text-secondary">
                <p><span className="font-semibold text-white">Challenge:</span> {study.challenge}</p>
                <p><span className="font-semibold text-white">Solution:</span> {study.solution}</p>
                <p className="text-accent">Results: {study.results}</p>
              </div>
            </LiquidGlass>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-heading text-3xl text-white">Our Insights</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <LiquidGlass as="article" key={post.title} variant="card" className="p-7">
              <p className="text-xs uppercase tracking-[0.4em] text-accent">{post.tag}</p>
              <h3 className="mt-4 font-heading text-2xl text-white">{post.title}</h3>
              <p className="mt-3 text-sm text-text-secondary">Coming soon — industry notes, playbooks, and field reports curated by DnD.</p>
            </LiquidGlass>
          ))}
        </div>
      </section>
    </div>
  )
}
