import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Start a Project' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 py-10 text-sm text-text-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-center md:flex-row md:items-center md:justify-between">
        <p className="font-heading text-lg text-white">DnD Solutions</p>
        <div className="flex flex-wrap justify-center gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-text-muted">© 2025 DnD Solutions</p>
      </div>
    </footer>
  )
}
