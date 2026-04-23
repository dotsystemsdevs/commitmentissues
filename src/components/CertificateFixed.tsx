'use client'

import { forwardRef } from 'react'
import type React from 'react'
import { DeathCertificate } from '@/lib/types'

const MONO = `var(--font-courier), system-ui, sans-serif`
const UI = `var(--font-dm), Georgia, serif`

// Inline SVG noise filter — rendered by the browser before html-to-image captures it,
// so it exports correctly without any external file dependency.
const PAPER_TEXTURE_SVG = (
  <svg
    aria-hidden
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="ci-paper-noise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
      <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
      <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
    </filter>
    <rect width="100%" height="100%" filter="url(#ci-paper-noise)" opacity="0.07" fill="#a07850" />
  </svg>
)

interface Props {
  cert: DeathCertificate
  visible?: boolean
  showStamp?: boolean
  stampRef?: React.Ref<HTMLDivElement>
}

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="#1A0F06">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
)

const ForkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="#1A0F06">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
  </svg>
)

const labelStyle = {
  fontFamily: MONO,
  fontSize: '13px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: '#8B6B4A',
}

const CertificateFixed = forwardRef<HTMLDivElement, Props>(
  function CertificateFixed({ cert, visible = true, showStamp = true, stampRef }, ref) {
    const { repoData: r } = cert
    const owner = r.fullName.split('/')[0]

    const stats: { icon: React.ReactNode; value: string; label: string }[] = [
      { icon: <StarIcon />, value: r.stargazersCount.toLocaleString(), label: 'stars' },
      { icon: <ForkIcon />, value: r.forksCount.toLocaleString(), label: 'forks' },
      ...(r.language ? [{ icon: null, value: r.language, label: 'language' }] : []),
    ]

    return (
      <div
        ref={ref}
        className="certificate-card"
        style={{
          position: 'relative',
          width: '794px',
          height: '1123px',
          background: '#FAF6EF',
          border: '5px solid #1A0F06',
          boxShadow: '0 7px 52px rgba(42,26,14,0.15)',
          boxSizing: 'border-box',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
          overflow: 'hidden',
        }}
      >
        {PAPER_TEXTURE_SVG}


        <div
          style={{
            flex: 1,
            border: '2px solid #1A0F06',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '44px 56px',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ textAlign: 'center', paddingBottom: '28px', borderBottom: '3px solid #1A0F06' }}>
            <h2 className="certificate-of-death-title" style={{ fontSize: '58px', color: '#1A0F06', lineHeight: 1.06, margin: '0 0 16px 0', whiteSpace: 'nowrap' }}>
              Certificate of Death
            </h2>
            <p style={{ fontFamily: MONO, fontSize: '13px', letterSpacing: '0.2em', color: '#8B6B4A', margin: 0, fontStyle: 'italic' }}>
              official record of abandonment
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '34px 0', borderBottom: '2px solid #C4A882' }}>
            <p style={{ ...labelStyle, margin: '0 0 14px 0' }}>this is to certify the death of</p>
            <p style={{ fontFamily: MONO, fontSize: '15px', color: '#8B6B4A', margin: '0 0 10px 0' }}>
              {owner} /
            </p>
            <h3 style={{ fontFamily: UI, fontWeight: 700, fontSize: '54px', color: '#1A0F06', lineHeight: 1.08, margin: 0, letterSpacing: '-0.02em' }}>
              {r.name}
            </h3>
            {r.description && (
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: '15px',
                  color: '#8B6B4A',
                  margin: '14px 0 0 0',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  maxHeight: '48px',
                }}
              >
                {r.description}
              </p>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '34px 0', borderBottom: '2px solid #C4A882' }}>
            <p style={{ ...labelStyle, margin: '0 0 14px 0', fontSize: '16px' }}>CAUSE OF DEATH</p>
            <p style={{ fontFamily: UI, fontStyle: 'italic', fontWeight: 600, fontSize: '36px', color: '#8B0000', lineHeight: 1.35, maxWidth: '560px', margin: '0' }}>
              {cert.causeOfDeath}
            </p>
          </div>

          <div style={{ padding: '18px 0', borderBottom: '2px solid #C4A882' }}>
            {[
              { label: 'Date of death', value: cert.deathDate },
              { label: 'Age at death', value: cert.age },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: i === 0 ? '1px solid #EDE5D8' : 'none' }}>
                <span style={{ fontFamily: MONO, fontSize: '15px', color: '#8B6B4A', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontFamily: MONO, fontSize: '17px', color: '#1A0F06', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', padding: '26px 0', borderBottom: '2px solid #C4A882' }}>
            {stats.map(({ icon, value, label }, i, arr) => (
              <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {icon}
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '24px', color: '#1A0F06', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                  <p style={{ fontFamily: MONO, fontSize: '12px', color: '#8B6B4A', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '8px 0 0 0' }}>{label}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', background: '#C4A882', flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '18px 0', borderBottom: '2px solid #C4A882', gap: '0' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '24px', color: '#1A0F06', lineHeight: 1 }}>{r.commitCount.toLocaleString()}</span>
              <p style={{ fontFamily: MONO, fontSize: '12px', color: '#8B6B4A', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '8px 0 0 0' }}>commits</p>
            </div>
            <div style={{ width: '1px', background: '#C4A882', alignSelf: 'stretch' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '24px', color: '#1A0F06', lineHeight: 1 }}>{r.openIssuesCount.toLocaleString()}</span>
              <p style={{ fontFamily: MONO, fontSize: '12px', color: '#8B6B4A', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '8px 0 0 0' }}>open issues</p>
            </div>
          </div>

          <div style={{ flex: 1, padding: '20px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ ...labelStyle, margin: '0 0 12px 0' }}>Last words</p>
            <p style={{
              fontFamily: UI, fontStyle: 'italic', fontWeight: 600, fontSize: '30px', color: '#8B0000',
              lineHeight: 1.3, margin: '0 auto', maxWidth: '540px',
              display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, overflow: 'hidden',
            }}>
              &ldquo;{cert.lastWords}&rdquo;
            </p>
          </div>

          {showStamp && (
            <div
              ref={stampRef}
              className="stamp-animate"
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '8px',
                paddingLeft: '16px',
                paddingRight: '16px',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <div style={{
                border: '3px solid rgba(139,26,26,0.65)',
                padding: '6px 18px',
                transform: 'rotate(-1.5deg)',
                background: 'rgba(139,26,26,0.03)',
                maxWidth: '100%',
              }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(139,26,26,0.7)', display: 'block', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  Issued · commitmentissues.dev
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }
)

export default CertificateFixed
