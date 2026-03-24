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
  keywords: ['github', 'dead repo', 'abandoned project', 'death certificate', 'side project', 'open source'],
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
  '@type': 'WebApplication',
  name: 'commitmentissues',
  description: 'Death certificates for abandoned GitHub repos',
  url: 'https://commitmentissues.dev',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '4.99', priceCurrency: 'USD' },
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
          className="coffee-btn"
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 50,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-courier), monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#938882',
            textDecoration: 'none',
            background: '#f5f5f5',
            border: '1.5px solid #e0dbd5',
            borderRadius: '6px',
            padding: '6px 10px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          🔌 server plug
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
