import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'
import { CTA_ISSUE, CTA_ISSUE_ARROW } from '@/lib/cta'

const FAQS = [
  { q: 'Is the data real?', a: 'Yes — we use GitHub\'s public API: commits, stars, issues, archive status.' },
  { q: 'How is the cause of death determined?', a: 'A scoring model based on inactivity, open issues, and archive status. Highest match wins.' },
  { q: 'Can I analyze private repos?', a: 'No — public repos only. No login required.' },
  { q: 'How do I share the certificate?', a: 'Generate → click Share → instant image. One click.' },
  { q: 'What does the $4.99 get me?', a: 'A high-res, print-ready PNG. Clean typography, no watermark. Frame-worthy.' },
  { q: 'Is this serious?', a: 'Not really. That\'s the point.' },
]

export default function FaqPage() {
  return (
    <SubpageShell
      subtitle="Official death certificates for abandoned GitHub repos."
      microcopy="Data is real. The certificates are not."
    >
      <div className="subpage-details">
        {FAQS.map(({ q, a }) => (
          <details key={q}>
            <summary>{q}</summary>
            <div className="subpage-details-answer">{a}</div>
          </details>
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '8px' }}>
        <Link href="/" className="subpage-faq-bottom-cta">
          {CTA_ISSUE_ARROW}
        </Link>
      </div>
    </SubpageShell>
  )
}
