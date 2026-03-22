import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Courier_Prime, UnifrakturMaguntia, Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

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
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
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
      <body className={`${playfair.variable} ${courierPrime.variable} ${unifraktur.variable} ${inter.variable} antialiased`}>
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
