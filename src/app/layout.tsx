import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://commitmentissues.dev'),
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  title: 'commitmentissues — death certificates for abandoned GitHub repos',
  description: 'Paste a GitHub URL. Get a death certificate.',
  openGraph: {
    title: 'commitmentissues',
    description: 'Paste a GitHub URL. Get a death certificate.',
    url: 'https://commitmentissues.dev',
    siteName: 'commitmentissues',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'commitmentissues',
    description: 'Paste a GitHub URL. Get a death certificate.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
