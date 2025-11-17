'use client'

import Marquee from 'react-fast-marquee'

const logos = [
  'your logo here',
  'artbyrbarr.com',
  'Black Diamond Settlement LLC',
  'Atlas Realty Partners',
  'Quantum Edge Lending',
  'Nova Property Group',
]

export default function ClientMarquee() {
  return (
    <Marquee gradient={false} speed={40} pauseOnHover>
      {logos.map((logo) => (
        <div key={logo} className="mx-8 flex items-center justify-center rounded-full border border-white/10 px-10 py-4 text-sm uppercase tracking-[0.4em] text-text-secondary">
          {logo}
        </div>
      ))}
    </Marquee>
  )
}
