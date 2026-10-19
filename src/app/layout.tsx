import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, UnifrakturMaguntia, Lora } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ScannerBanner from '@/components/ScannerBanner'
import './globals.css'
import './halloween.css'
import HalloweenLayer from '@/components/HalloweenLayer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-courier',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '700'],
  style: ['normal', 'italic'],
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
  themeColor: '#0F0C09',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://commitmentissues.dev'),
  title: 'Commitment Issues: Death Certificates for Dead GitHub Repos',
  description: 'Paste any public GitHub repo and get an official death certificate: cause of death, last commit as last words, and repo stats. Free for developers.',
  keywords: [
    'abandoned github repo', 'dead github project', 'github repo death certificate',
    'unmaintained open source', 'stale repository checker', 'github graveyard',
    'side project syndrome', 'dead project', 'abandoned side project',
    'github repo stats', 'last commit checker', 'repo activity',
    'commitmentissues', 'developer humor', 'github tools',
  ],
  authors: [{ name: 'Stackpine', url: 'https://stackpine.app' }],
  alternates: { canonical: 'https://commitmentissues.dev' },
  openGraph: {
    title: 'Commitment Issues: Death Certificates for Dead GitHub Repos',
    description: 'Paste any public GitHub repo and get an official death certificate. Cause of death, last words, repo stats. Free for developers.',
    url: 'https://commitmentissues.dev',
    siteName: 'Commitment Issues',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commitment Issues: Death Certificates for Dead GitHub Repos',
    description: 'Paste any public GitHub repo and get an official death certificate. Cause of death, last words, repo stats.',
    images: ['/opengraph-image'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://commitmentissues.dev/#website',
      url: 'https://commitmentissues.dev',
      name: 'Commitment Issues',
      description: 'Death certificate generator for abandoned GitHub repositories.',
      inLanguage: 'en',
      publisher: { '@id': 'https://commitmentissues.dev/#org' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://commitmentissues.dev/?repo={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://commitmentissues.dev/#app',
      name: 'Commitment Issues',
      alternateName: 'commitmentissues.dev',
      description: 'Free tool that generates official death certificates for abandoned GitHub repos. Paste any public repo URL to see the cause of death, last commit as last words, and full repo stats.',
      url: 'https://commitmentissues.dev',
      image: 'https://commitmentissues.dev/opengraph-image',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled',
      inLanguage: 'en',
      isAccessibleForFree: true,
      featureList: [
        'Death certificate generation for GitHub repos',
        'Cause of death analysis based on commit activity',
        'Last commit as last words',
        'Shareable certificate image',
        'README badge embed',
      ],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://commitmentissues.dev/pricing' },
      creator: { '@id': 'https://commitmentissues.dev/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://commitmentissues.dev/#org',
      name: 'Stackpine',
      url: 'https://stackpine.app',
      logo: 'https://stackpine.app/stackpine-logo.png',
      description: 'Independent app studio. Maker of Commitment Issues.',
      sameAs: [
        'https://github.com/dotsystemsdevs',
        'https://x.com/stackpinehq',
        'https://www.instagram.com/stackpinehq/',
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.setAttribute('data-theme','dark');var q=new URLSearchParams(location.search).get('halloween'),d=new Date().toISOString().slice(0,10),h=q==='1'||(q!=='0'&&d>='2026-10-15'&&d<='2026-11-02');if(h)document.documentElement.setAttribute('data-halloween','1')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${unifraktur.variable} ${lora.variable} antialiased`}>
        <HalloweenLayer />
        <ScannerBanner />
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
