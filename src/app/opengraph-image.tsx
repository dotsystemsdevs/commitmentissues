import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div style={{ background: '#1a1a1a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 80, color: '#f5f0e8' }}>🪦</div>
      <div style={{ fontSize: 56, color: '#f5f0e8', fontFamily: 'serif', marginTop: 16 }}>commitmentissues</div>
      <div style={{ fontSize: 22, color: '#8b7355', fontFamily: 'monospace', marginTop: 12 }}>death certificates for abandoned GitHub repos</div>
    </div>
  )
}
