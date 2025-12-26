import type { DemoContentOverride } from './content'

export type IndustryId = 'finance' | 'healthcare' | 'manufacturing' | 'saas' | 'retail' | 'security'

export type IndustryProfile = {
  id: IndustryId
  displayName: string
  description: string
  copy: DemoContentOverride
  palette: {
    primary: string
    secondary: string
    glow: string
    icon: string
  }
  labels: {
    leads: string
    revenue: string
    pipeline: string
    users: string
  }
}

export const DEFAULT_LABELS = {
  leads: 'Leads',
  revenue: 'Revenue',
  pipeline: 'Pipeline',
  users: 'Users',
}

export const industryProfiles: IndustryProfile[] = [
  {
    id: 'finance',
    displayName: 'Finance',
    description: 'Risk-aware, data-first systems.',
    copy: {
      hero: {
        title: 'Risk-aware. Data-first. Performance-driven.',
        subtitle: 'Institutional-grade digital systems that keep growth compliant and measurable.',
        ctaPrimary: 'Request a Strategy Session',
        ctaSecondary: 'View Finance Demos',
      },
      demos: {
        sectionTitle: 'Financial-grade systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview builder overlays, tuned backgrounds, and KPI funnels for regulated growth.',
      },
      cta: {
        primary: 'Schedule a Growth Brief',
        secondary: 'Explore Finance Resources',
      },
    },
    palette: {
      primary: '#5AB0FF',
      secondary: '#D1B15C',
      glow: 'rgba(90, 176, 255, 0.45)',
      icon: '#9BD0FF',
    },
    labels: {
      leads: 'Deal Flow',
      revenue: 'AUM Impact',
      pipeline: 'Pipeline',
      users: 'Accounts',
    },
  },
  {
    id: 'healthcare',
    displayName: 'Healthcare',
    description: 'Clear, compliant, patient-first systems.',
    copy: {
      hero: {
        title: 'Clear, compliant, patient-centered systems.',
        subtitle: 'Digital infrastructure that simplifies care journeys and protects trust.',
        ctaPrimary: 'Plan Your Patient Flow',
        ctaSecondary: 'View Care Demos',
      },
      demos: {
        sectionTitle: 'Patient-ready systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview calm overlays, background profiles, and KPI funnels for care teams.',
      },
      cta: {
        primary: 'Book a Care Systems Call',
        secondary: 'Explore Healthcare Insights',
      },
    },
    palette: {
      primary: '#42D4B2',
      secondary: '#74F0C1',
      glow: 'rgba(66, 212, 178, 0.45)',
      icon: '#8FF5D7',
    },
    labels: {
      leads: 'Patients',
      revenue: 'Care Value',
      pipeline: 'Referrals',
      users: 'Care Teams',
    },
  },
  {
    id: 'manufacturing',
    displayName: 'Manufacturing',
    description: 'Operational clarity from floor to forecast.',
    copy: {
      hero: {
        title: 'Operational clarity from floor to forecast.',
        subtitle: 'Connected systems that surface throughput, quality, and bottlenecks in real time.',
        ctaPrimary: 'Optimize Throughput',
        ctaSecondary: 'View Ops Demos',
      },
      demos: {
        sectionTitle: 'Operational systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview operational overlays, background tuning, and KPI funnels that surface throughput.',
      },
      cta: {
        primary: 'Plan an Operations Review',
        secondary: 'Explore Manufacturing Resources',
      },
    },
    palette: {
      primary: '#A7B3C6',
      secondary: '#F5A623',
      glow: 'rgba(245, 166, 35, 0.38)',
      icon: '#D6DEE8',
    },
    labels: {
      leads: 'Opportunities',
      revenue: 'Throughput',
      pipeline: 'Supply Flow',
      users: 'Operators',
    },
  },
  {
    id: 'saas',
    displayName: 'SaaS',
    description: 'Scale-ready platforms built for velocity.',
    copy: {
      hero: {
        title: 'Scale-ready platforms built for velocity.',
        subtitle: 'Launch, iterate, and optimize growth loops with engineered precision.',
        ctaPrimary: 'Start a Growth Sprint',
        ctaSecondary: 'View SaaS Demos',
      },
      demos: {
        sectionTitle: 'SaaS systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview builder overlays, growth-ready backgrounds, and KPI funnels for SaaS teams.',
      },
      cta: {
        primary: 'Book a SaaS Build Call',
        secondary: 'Explore Product Resources',
      },
    },
    palette: {
      primary: '#5B8CFF',
      secondary: '#6FFFD2',
      glow: 'rgba(111, 255, 210, 0.4)',
      icon: '#9FB8FF',
    },
    labels: {
      leads: 'Trials',
      revenue: 'MRR',
      pipeline: 'Pipeline',
      users: 'Accounts',
    },
  },
  {
    id: 'retail',
    displayName: 'Retail',
    description: 'Conversion-led commerce systems.',
    copy: {
      hero: {
        title: 'Conversion-led commerce with brand-grade polish.',
        subtitle: 'Merchandising, loyalty, and lifecycle automation designed for repeat revenue.',
        ctaPrimary: 'Launch a Commerce Sprint',
        ctaSecondary: 'View Retail Demos',
      },
      demos: {
        sectionTitle: 'Retail systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview commerce overlays, conversion-ready backgrounds, and KPI funnels.',
      },
      cta: {
        primary: 'Plan a Commerce Revamp',
        secondary: 'Explore Retail Resources',
      },
    },
    palette: {
      primary: '#FF6A3D',
      secondary: '#FFB347',
      glow: 'rgba(255, 106, 61, 0.45)',
      icon: '#FFC0A0',
    },
    labels: {
      leads: 'Shoppers',
      revenue: 'Order Value',
      pipeline: 'Lifecycle',
      users: 'Customers',
    },
  },
  {
    id: 'security',
    displayName: 'Security',
    description: 'Resilient, risk-aware digital control.',
    copy: {
      hero: {
        title: 'Secure-by-design systems for high-trust teams.',
        subtitle: 'Defense-grade UX with visibility, control, and performance in every layer.',
        ctaPrimary: 'Request a Security Brief',
        ctaSecondary: 'View Security Demos',
      },
      demos: {
        sectionTitle: 'Security systems, demonstrated live',
        sectionSubtitle: 'Customize this site to preview hardened overlays, dark background profiles, and KPI funnels for risk teams.',
      },
      cta: {
        primary: 'Plan a Secure Build',
        secondary: 'Explore Security Resources',
      },
    },
    palette: {
      primary: '#8E1B24',
      secondary: '#0F0608',
      glow: 'rgba(142, 27, 36, 0.5)',
      icon: '#E2A0A8',
    },
    labels: {
      leads: 'Incidents',
      revenue: 'Risk Impact',
      pipeline: 'Threat Flow',
      users: 'Operators',
    },
  },
]
