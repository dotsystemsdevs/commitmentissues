import Link from 'next/link'

const UI = `var(--font-dm), -apple-system, sans-serif`

const FAQ = [
  { q: 'Is the data real?', a: 'Yes. Everything comes from GitHub\'s public API - last commit date, stars, forks, open issues, and archive status.' },
  { q: 'How is the cause of death determined?', a: 'A scoring algorithm weighs inactivity, star count, open issues, and whether the repo is archived. The highest-matching rule wins.' },
  { q: 'Can I analyze private repos?', a: 'No - we only have access to public repositories.' },
  { q: 'How do I share the certificate?', a: 'Click Share to get a 1080×1350 image for Instagram or X. Download the printable certificate for $4.99.' },
  { q: 'Is this serious?', a: 'The data is real. The certificates are not.' },
]

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: '620px' }}>

        <div style={{ textAlign: 'center', paddingTop: '44px', paddingBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '56px', lineHeight: 1, marginBottom: '12px' }}>🪦</div>
            <h1 style={{ fontFamily: 'var(--font-gothic), serif', fontSize: 'clamp(2.4rem, 7vw, 3.6rem)', color: '#160A06', lineHeight: 0.95, marginBottom: '16px' }}>
              Certificate of Death
            </h1>
          </Link>
          <p style={{ fontFamily: UI, fontSize: '15px', color: '#938882', lineHeight: 1.6, margin: '0 auto', maxWidth: '420px' }}>
            We issue official death certificates for the repos the internet forgot.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #c8c8c8', paddingTop: '40px', paddingBottom: '64px' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontFamily: UI, fontSize: '17px', color: '#160A06', lineHeight: 1.8, marginBottom: '16px' }}>
              Official death certificates for abandoned GitHub repos.
            </p>
            <p style={{ fontFamily: UI, fontSize: '15px', fontStyle: 'italic', color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
              Paste any public GitHub URL. We analyze commit history, stars, open issues, and archive status - then issue a certified cause of death.
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

          <div style={{ marginTop: '48px' }}>
            <Link href="/" style={{ fontFamily: UI, fontSize: '14px', fontStyle: 'italic', color: '#8b0000', textDecoration: 'none' }}>
              Issue death certificate →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
