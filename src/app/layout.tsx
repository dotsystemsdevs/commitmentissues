import type { Metadata, Viewport } from 'next'
import { Courier_Prime, UnifrakturMaguntia, Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-courier',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

const unifraktur = UnifrakturMaguntia({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gothic',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#160A06',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://commitmentissues.dev'),
  title: 'commitmentissues — Death Certificates for Abandoned GitHub Repos',
  description: 'Paste any GitHub URL. Get an official death certificate for your abandoned repo. Cause of death, last words, and more.',
  keywords: ['github', 'dead repo', 'abandoned project', 'death certificate', 'side project', 'open source', 'abandoned github repository', 'repo graveyard', 'unmaintained project', 'stale repository', 'github stats', 'commit activity'],
  authors: [{ name: 'Dot Systems', url: 'https://github.com/dotsystemsdevs' }],
  alternates: { canonical: 'https://commitmentissues.dev' },
  openGraph: {
    title: 'commitmentissues - Death Certificates for Abandoned GitHub Repos',
    description: 'Paste any GitHub URL. Get an official death certificate for your abandoned repo. Cause of death, last words, and more.',
    url: 'https://commitmentissues.dev',
    siteName: 'commitmentissues',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'commitmentissues - Death Certificates for Abandoned GitHub Repos',
    description: 'Paste any GitHub URL. Get an official death certificate for your abandoned repo.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'commitmentissues',
      description: 'Death certificates for abandoned GitHub repos',
      url: 'https://commitmentissues.dev',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      creator: { '@type': 'Organization', name: 'Dot Systems', url: 'https://github.com/dotsystemsdevs' },
    },
    {
      '@type': 'Organization',
      name: 'Dot Systems',
      url: 'https://github.com/dotsystemsdevs',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${courierPrime.variable} ${unifraktur.variable} ${inter.variable} antialiased`}>
        <a
          href="https://buymeacoffee.com/commitmentissues"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy me a coffee"
          className="coffee-btn-fixed"
          style={{
            position: 'fixed',
            top: '12px',
            right: '14px',
            zIndex: 999,
            fontFamily: `var(--font-dm), -apple-system, sans-serif`,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: '#1a1a1a',
            textDecoration: 'none',
            padding: '7px 12px',
            border: '1.5px solid #1a1a1a',
            background: '#f6f6f6',
            whiteSpace: 'nowrap',
          }}
        >
          ☕ Don&apos;t let us die too
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
        <Script
          defer
          data-domain="commitmentissues.dev"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
