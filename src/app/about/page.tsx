import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE_ARROW } from '@/lib/cta'

const UI = `var(--font-dm), -apple-system, sans-serif`

const FAQ = [
  { q: 'Is the data real?', a: 'Yes. Everything comes from GitHub\'s public API - last commit date, stars, forks, open issues, and archive status.' },
  { q: 'How is the cause of death determined?', a: 'A scoring algorithm weighs inactivity, star count, open issues, and whether the repo is archived. The highest-matching rule wins.' },
  { q: 'Can I analyze private repos?', a: 'No - we only have access to public repositories.' },
  { q: 'How do I share the certificate?', a: 'Hit the share button → pick your option. Copy the link, post on X, or download a watermarked PNG. One click.' },
  { q: 'Is this serious?', a: 'The data is real. The certificates are not.' },
]

export default function AboutPage() {
  return (
    <SubpageShell
      subtitle="We issue official death certificates for the repos the internet forgot."
      microcopy="About · commitmentissues.dev"
    >
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: UI, fontSize: '17px', color: '#160A06', lineHeight: 1.8, marginBottom: '16px' }}>
          Official death certificates for abandoned GitHub repos.
        </p>
        <p style={{ fontFamily: UI, fontSize: '15px', fontStyle: 'italic', color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
          Paste any public GitHub URL. We analyze commit history, stars, open issues, and archive status — then issue a certified cause of death.
        </p>
        <p style={{ fontFamily: UI, fontSize: '15px', color: '#555', lineHeight: 1.8 }}>
          Download the certificate. Share it. Mourn accordingly.
        </p>
      </div>

      <p style={{ fontFamily: UI, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#938882', marginBottom: '24px' }}>FAQ</p>
      {FAQ.map(({ q, a }, i) => (
        <div key={q} style={{ padding: '20px 0', borderBottom: i < FAQ.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
          <p style={{ fontFamily: UI, fontSize: '15px', fontWeight: 700, color: '#160A06', marginBottom: '8px' }}>{q}</p>
          <p style={{ fontFamily: UI, fontSize: '14px', color: '#555', lineHeight: 1.75, margin: 0 }}>{a}</p>
        </div>
      ))}

      <div className="subpage-bottom-links" style={{ marginTop: '40px' }}>
        <Link href="/" className="subpage-bottom-primary">
          {CTA_ISSUE_ARROW}
        </Link>
      </div>
    </SubpageShell>
  )
}
