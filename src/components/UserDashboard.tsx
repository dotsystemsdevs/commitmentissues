'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import type { UserRepoSummary } from '@/lib/types'

const FONT = `var(--font-dm), -apple-system, sans-serif`
const MONO = `var(--font-courier), 'Courier New', monospace`

type Category = 'dead dead' | 'struggling' | 'alive'

function classify(repo: UserRepoSummary): Category {
  if (repo.isArchived || repo.daysSincePush >= 730) return 'dead dead'
  if (repo.daysSincePush >= 90) return 'struggling'
  return 'alive'
}

interface Props {
  username: string
  repos: UserRepoSummary[]
}

export default function UserDashboard({ username, repos }: Props) {
  const dead       = repos.filter(r => classify(r) === 'dead dead')
  const struggling = repos.filter(r => classify(r) === 'struggling')
  const alive      = repos.filter(r => classify(r) === 'alive')
  const healthScore = repos.length > 0 ? Math.round((alive.length / repos.length) * 100) : 0

  return (
    <div style={{ width: '100%', fontFamily: FONT }}>

      {/* ── Stat row ── */}
      <div style={{ marginBottom: '28px' }}>
        {/* Stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          {[
            { label: 'dead dead',  count: dead.length,       bg: '#0a0a0a', text: '#fff',    sub: '#888' },
            { label: 'struggling', count: struggling.length, bg: '#3a0000', text: '#fff',    sub: '#e08888' },
            { label: 'alive',      count: alive.length,      bg: '#FAF6EF', text: '#160A06', sub: '#666', border: true },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: s.border ? '2px solid #0a0a0a' : `2px solid ${s.bg}`, padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: FONT, fontSize: '32px', fontWeight: 800, color: s.text, lineHeight: 1 }}>
                {s.count}
              </div>
              <div style={{ fontFamily: MONO, fontSize: '10px', color: s.sub, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '6px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Health score bar */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '4px', background: '#e4ddd4', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${healthScore}%`, background: healthScore >= 50 ? '#3a7d44' : healthScore >= 25 ? '#8B6914' : '#8B0000', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: '11px', color: '#8a8a8a', whiteSpace: 'nowrap' }}>
            {healthScore}/100
          </span>
        </div>
      </div>

      {repos.length === 0 && (
        <p style={{ fontFamily: FONT, fontSize: '14px', color: '#8a8a8a', textAlign: 'center', padding: '40px 0' }}>
          no public repos found.
        </p>
      )}

      {/* ── Dead Dead ── */}
      {dead.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#727272', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Dead Dead
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dead.map(repo => {
              const [owner, repoName] = repo.fullName.split('/')
              return (
                <div key={repo.fullName} style={{ padding: '20px', background: '#0a0a0a', border: '2px solid #1a1a1a', boxShadow: '0 1px 4px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '18px' }}>🪦</span>
                  <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                    {repo.name}
                    {repo.isArchived && <span style={{ fontFamily: MONO, fontSize: '10px', color: '#888', fontWeight: 400, marginLeft: '8px' }}>archived</span>}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: '14px', fontStyle: 'italic', color: '#aaaaaa', lineHeight: 1.5, fontWeight: 500 }}>
                    {repo.causeOfDeath}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                    <span style={{ fontFamily: FONT, fontSize: '12px', color: '#666' }}>
                      {repo.lastCommitDate} · {repo.daysSincePush}d ago
                    </span>
                    <Link
                      href={`/repo/${owner}/${repoName}`}
                      onClick={() => track('user_dashboard_repo_clicked', { repo: repo.fullName })}
                      style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', padding: '8px 14px', background: '#0a0a0a', border: '2px solid #0a0a0a', color: '#FAF6EF', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block', transition: 'background 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0a0a' }}
                    >
                      Issue Certificate →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Struggling ── */}
      {struggling.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#727272', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Struggling
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {struggling.map(repo => (
              <div key={repo.fullName} style={{ padding: '20px', background: '#3a0000', border: '2px solid #1a1a1a', boxShadow: '0 1px 4px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                  {repo.name}
                  {repo.isArchived && <span style={{ fontFamily: MONO, fontSize: '10px', color: '#884444', fontWeight: 400, marginLeft: '8px' }}>archived</span>}
                </span>
                {repo.description && (
                  <span style={{ fontFamily: FONT, fontSize: '14px', fontStyle: 'italic', color: '#f0a0a0', lineHeight: 1.5, fontWeight: 500 }}>
                    {repo.description}
                  </span>
                )}
                <span style={{ fontFamily: FONT, fontSize: '12px', color: '#884444', marginTop: '6px' }}>
                  {repo.lastCommitDate} · {repo.daysSincePush}d ago
                </span>
              </div>
            ))}
          </div>
        </div>
      )}


      <p style={{ fontFamily: MONO, fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '16px', letterSpacing: '0.06em' }}>
        {repos.length} public repos scanned
      </p>

    </div>
  )
}
