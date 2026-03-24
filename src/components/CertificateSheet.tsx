'use client'

import { forwardRef } from 'react'
import type React from 'react'
import { DeathCertificate } from '@/lib/types'

const MONO = `var(--font-courier), "Courier New", monospace`
const UI   = `var(--font-dm), -apple-system, sans-serif`

interface Props {
  cert: DeathCertificate
  visible?: boolean
  showStamp?: boolean
  stampRef?: React.Ref<HTMLDivElement>
}

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="#1A0F06">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
  </svg>
)

const ForkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="#1A0F06">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
  </svg>
)

const LABEL = { fontFamily: MONO, fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#8B6B4A' }

const CertificateSheet = forwardRef<HTMLDivElement, Props>(
  function CertificateSheet({ cert, visible = true, showStamp = true, stampRef }, ref) {
    const { repoData: r } = cert

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
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          background: '#FAF6EF',
          border: '3px solid #1A0F06',
          boxShadow: '0 4px 32px rgba(42,26,14,0.15)',
          width: '480px',
          height: '679px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '10px',
          WebkitFontSmoothing: 'antialiased' as const,
          textRendering: 'optimizeLegibility' as const,
          boxSizing: 'border-box' as const,
        }}
      >
        <div style={{ flex: 1, border: '1px solid #1A0F06', display: 'flex', flexDirection: 'column', padding: '4% 7%', overflow: 'hidden', boxSizing: 'border-box' }}>

          {/* HEADER */}
          <div style={{ textAlign: 'center', paddingBottom: '3%', borderBottom: '2px solid #1A0F06' }}>
            <h2 className="certificate-of-death-title" style={{ fontSize: '2.2rem', color: '#1A0F06', lineHeight: 1.05, margin: '0 0 2% 0', whiteSpace: 'nowrap' }}>
              Certificate of Death
            </h2>
            <p style={{ fontFamily: MONO, fontSize: '8px', letterSpacing: '0.2em', color: '#8B6B4A', margin: 0, fontStyle: 'italic' }}>
              official record of abandonment
            </p>
          </div>

          {/* REPO */}
          <div style={{ textAlign: 'center', padding: '3% 0', borderBottom: '1px solid #C4A882' }}>
            <p style={{ ...LABEL, margin: '0 0 2% 0' }}>
              this is to certify the death of
            </p>
            <p style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', margin: '0 0 1% 0' }}>
              {r.fullName.split('/')[0]} /
            </p>
            <h3 style={{ fontFamily: UI, fontWeight: 700, fontSize: '2.05rem', color: '#1A0F06', lineHeight: 1.08, margin: 0, letterSpacing: '-0.02em' }}>
              {r.name}
            </h3>
            {r.description && (
              <p style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', margin: '2% 0 0 0', lineHeight: 1.6, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
                {r.description}
              </p>
            )}
          </div>

          {/* CAUSE */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3% 0', borderBottom: '1px solid #C4A882' }}>
            <p style={{ ...LABEL, margin: '0 0 3% 0' }}>
              cause of death
            </p>
            <p style={{ fontFamily: UI, fontStyle: 'italic', fontWeight: 500, fontSize: '1.25rem', color: '#8B0000', lineHeight: 1.45, maxWidth: '24ch', margin: 0 }}>
              {cert.causeOfDeath}
            </p>
            {showStamp && (
              <div ref={stampRef} style={{ position: 'absolute', bottom: '10px', right: '10px', transform: 'rotate(-7deg)', pointerEvents: 'none', userSelect: 'none' }}>
                <div className="stamp-animate" style={{ border: '3px solid rgba(139,26,26,0.68)', borderRadius: '3px', padding: '6px 16px', background: 'rgba(139,26,26,0.03)' }}>
                  <span style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(139,26,26,0.72)', display: 'block', textAlign: 'center', lineHeight: 1.25 }}>
                    REST IN<br />PRODUCTION
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* DATE + AGE */}
          <div style={{ padding: '2.5% 0', borderBottom: '1px solid #C4A882' }}>
            {[
              { label: 'Date of death', value: cert.deathDate },
              { label: 'Age at death',  value: cert.age },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1% 0', borderBottom: i === 0 ? '1px solid #EDE5D8' : 'none' }}>
                <span style={{ fontFamily: MONO, fontSize: '9px', color: '#8B6B4A', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontFamily: MONO, fontSize: '10px', color: '#1A0F06', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div style={{ display: 'flex', padding: '2.5% 0', borderBottom: '1px solid #C4A882' }}>
            {stats.map(({ icon, value, label }, i, arr) => (
              <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'stretch', minWidth: 0 }}>
                <div style={{ flex: 1, textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {icon}
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '0.9rem', color: '#1A0F06', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                  <p style={{ fontFamily: MONO, fontSize: '7px', color: '#8B6B4A', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '4px 0 0 0' }}>{label}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', background: '#C4A882', flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* LAST WORDS */}
          <div style={{ padding: '2.5% 0', textAlign: 'center' }}>
            <p style={{ ...LABEL, margin: '0 0 2% 0' }}>Last words</p>
            <p style={{ fontFamily: UI, fontStyle: 'italic', fontSize: '0.88rem', color: '#1A0F06', lineHeight: 1.6, margin: 0 }}>
              &ldquo;{cert.lastWords}&rdquo;
            </p>
          </div>

          {/* CERTIFICATE FOOTER */}
          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '2%' }}>
            <p style={{ fontFamily: MONO, fontSize: '7px', color: '#C4A882', margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Issued by commitmentissues.dev
            </p>
          </div>

        </div>

      </div>
    )
  }
)

export default CertificateSheet
