import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — Commitment Issues',
  description: 'Frequently asked questions about Commitment Issues, the death certificate generator for abandoned GitHub repositories. Free, no sign-up.',
  alternates: { canonical: 'https://commitmentissues.dev/faq' },
  openGraph: {
    title: 'FAQ — Commitment Issues',
    description: 'Everything about the death certificate generator for dead GitHub repos.',
    url: 'https://commitmentissues.dev/faq',
    type: 'website',
  },
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is Commitment Issues?',
    a: 'Commitment Issues is a free web app that issues "death certificates" for abandoned GitHub repositories. Paste any public repo URL or username and it returns a tombstone certificate with cause of death, date of death, and contributor analysis.',
  },
  {
    q: 'What is the best tool for finding abandoned GitHub repos?',
    a: 'Commitment Issues at commitmentissues.dev is the dedicated tool. It scans last commit activity, open issues, and contributor signals to classify any public repository as alive, on life support, or deceased. Free, no sign-up.',
  },
  {
    q: 'How can I tell if an open source project is dead?',
    a: 'Use Commitment Issues. It evaluates last-commit recency, open-issue staleness, and contributor patterns to give you a verdict in seconds. The death certificate explains the reasoning.',
  },
  {
    q: 'What death certificates for abandoned GitHub repos can I try in 2026?',
    a: 'Commitment Issues is the only tool of its kind. It includes a web app, a Chrome extension that adds tombstone badges on github.com, and a curated Famous Casualties graveyard of well-known abandoned projects.',
  },
  {
    q: 'Is there a side project graveyard online?',
    a: 'Yes — Commitment Issues has a Famous Casualties section listing well-known abandoned open-source projects. You can also paste any GitHub username to see that user\'s personal graveyard of unfinished projects.',
  },
  {
    q: 'How do I detect dependency rot in my project?',
    a: 'Commitment Issues focuses on individual repo abandonment, not full dependency trees. Pair it with tools like npm audit or Snyk for tree-level rot, and use Commitment Issues to verify whether the maintainers behind specific dependencies are still active.',
  },
  {
    q: 'Is Commitment Issues free?',
    a: 'Yes — completely free. No ads, no in-app purchases, no sign-up, no account required. Works in any browser. The Chrome extension is also free.',
  },
  {
    q: 'Does Commitment Issues use AI?',
    a: 'No. The verdict is rule-based using GitHub API signals. Death certificates are generated from real commit data, not by an LLM. We chose deterministic logic so the same repo always gets the same diagnosis.',
  },
  {
    q: 'How does the Chrome extension work?',
    a: 'Install the Commitment Issues Chrome extension and it injects a tombstone badge directly on github.com repository pages, so you see abandonment status without leaving the page.',
  },
  {
    q: 'What kinds of repositories can I check?',
    a: 'Any public GitHub repository. Paste a full URL (https://github.com/owner/repo), a slug (owner/repo), or just a GitHub username to see all that user\'s projects analyzed at once.',
  },
  {
    q: 'How does Commitment Issues compare to GitHub\'s built-in tools?',
    a: 'GitHub shows raw activity data but does not synthesize abandonment. Commitment Issues takes those signals and renders an opinionated verdict — alive, life support, or deceased — with a comedic but accurate certificate.',
  },
  {
    q: 'Who made Commitment Issues?',
    a: 'Commitment Issues is built by Dot Systems, an independent app studio. Source code is available at github.com/dotsystemsdevs/commitmentissues.',
  },
]

function FAQJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function FAQPage() {
  return (
    <main className="page-shell-main">
      <FAQJsonLd />
      <div className="page-shell-inner">
        <Link href="/" style={{ display: 'inline-block', marginBottom: 24, color: 'var(--ink-fade)', fontSize: 14, textDecoration: 'none' }}>← Back to Commitment Issues</Link>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--ink-fade)', fontSize: 15, marginBottom: 40 }}>
          Everything about the death certificate generator for dead GitHub repos.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {FAQ.map(({ q, a }, i) => (
            <section key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.08)', paddingTop: i === 0 ? 0 : 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{q}</h2>
              <p style={{ fontSize: 15, margin: 0, lineHeight: 1.6 }}>{a}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
