import LiquidGlass from '@/components/ui/LiquidGlass'

export default function AboutPage() {
  return (
    <div className="space-y-16 no-hover-zone pt-16">
      <header className="space-y-4">
        <h1 className="font-heading text-5xl text-white">About DnD Solutions</h1>
        <p className="text-lg text-text-secondary">A technical consulting and engineering firm building systems for modern businesses.</p>
      </header>

      <LiquidGlass as="section" variant="panel" className="space-y-6 p-10">
        <h2 className="font-heading text-3xl text-white">Our Story</h2>
        <p className="text-text-secondary">
          DnD Solutions was born from seeing a pattern we couldn’t ignore: businesses with real potential held back by unoptimized systems, outdated websites, and poor online visibility. We started by helping small teams fix what was broken—cleaning up sites, repairing digital presence, and streamlining the workflows that slowed growth.

As those early clients improved, expectations grew. Fixes turned into systems. One-off optimizations became unified dashboards, automated review pipelines, faster launches, and AI-driven routines. At the same time, we applied the same principles internally—optimizing how we worked, scaled, and delivered—proving the model before offering it at larger scale.

Today, DnD Solutions designs and engineers full-scale growth systems: digital audits, SEO flywheels, social and operational automation, custom backend platforms, and continuous optimization labs. Every engagement is built with a single focus—aligning strategy and execution to move the metrics that actually matter.

We’re not here to add tools to the stack. We’re here to build systems that compound.
        </p>
        <p className="text-text-secondary">
          Today we choreograph full-scale systems: digital audits, SEO flywheels, social automations, backend platforms, and optimization labs. Every engagement is a curated experience with a single mission—move the metrics that matter.
        </p>
      </LiquidGlass>

      <LiquidGlass as="section" variant="panel" className="p-12 text-center">
        <h2 className="font-heading text-3xl text-white">Our Mission</h2>
        <blockquote className="mx-auto mt-6 max-w-3xl text-2xl text-white">
          “We build digital systems designed to perform, scale, and evolve alongside your business.”
        </blockquote>
      </LiquidGlass>
    </div>
  )
}
