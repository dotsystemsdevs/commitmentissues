/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/pricing', destination: '/', permanent: true },
      { source: '/pricing/', destination: '/', permanent: true },
      { source: '/faq', destination: '/', permanent: true },
      { source: '/faq/', destination: '/', permanent: true },
      { source: '/privacy', destination: '/terms', permanent: true },
      { source: '/privacy/', destination: '/terms', permanent: true },
      { source: '/success', destination: '/', permanent: true },
      { source: '/success/', destination: '/', permanent: true },
      { source: '/cancel', destination: '/', permanent: true },
      { source: '/cancel/', destination: '/', permanent: true },
      { source: '/refund', destination: '/terms', permanent: true },
      { source: '/refund/', destination: '/terms', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
