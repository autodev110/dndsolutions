'use client'

import Marquee from 'react-fast-marquee'

const logos = ['logo placeholder 01', 'logo placeholder 02', 'logo placeholder 03', 'logo placeholder 04', 'logo placeholder 05', 'logo placeholder 06']

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
