'use client'

import { useState } from 'react'
import type { UserRepoSummary } from '@/lib/types'

const MONO = `var(--font-courier), system-ui, sans-serif`
const SERIF = `var(--font-dm), Georgia, serif`

type Tab = 'dead' | 'struggling' | 'alive'

const SECTIONS = [
  {
    key: 'dead' as Tab,
    label: 'Dead',
    color: '#8B0000',
    activeTextColor: '#fff',
    intro: 'Filed for permanent closure.',
  },
  {
    key: 'struggling' as Tab,
    label: 'Struggling',
    color: '#b45309',
    activeTextColor: '#fff',
    intro: 'Active intervention recommended.',
  },
  {
    key: 'alive' as Tab,
    label: 'Alive',
    color: '#2d7a3c',
    activeTextColor: '#fff',
    intro: 'No action required.',
  },
]

interface Props {
  repos: UserRepoSummary[]
  username: string
}

export default function UserDashboard({ repos, username }: Props) {
  const dead       = repos.filter(r => r.isDead)
  const struggling = repos.filter(r => r.isStruggling)
  const alive      = repos.filter(r => !r.isDead && !r.isStruggling)

  const counts = { dead: dead.length, struggling: struggling.length, alive: alive.length }
  const defaultTab: Tab = dead.length > 0 ? 'dead' : struggling.length > 0 ? 'struggling' : 'alive'
  const [tab, setTab] = useState<Tab>(defaultTab)

  if (repos.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '40px 0', fontFamily: MONO, fontSize: '11px', color: 'var(--c-muted)', letterSpacing: '0.08em' }}>
        No public repositories found for @{username}.
      </p>
    )
  }

  const activeSection = SECTIONS.find(s => s.key === tab)!
  const currentRepos = tab === 'dead' ? dead : tab === 'struggling' ? struggling : alive

  return (
    <div style={{ width: '100%', paddingBottom: '40px' }}>

      {/* Tab bar — horizontally scrollable on small screens */}
      <div className="user-dash-tabs" style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid var(--c-border)' }}>
        {SECTIONS.map(({ key, label, color }) => {
          const isActive = tab === key
          const disabled = counts[key] === 0
          return (
            <button
              key={key}
              className="user-dash-tab-btn"
              onClick={() => { if (!disabled) setTab(key) }}
              disabled={disabled}
              style={{
                fontFamily: MONO,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '10px 18px 12px',
                background: isActive ? color : 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
                marginBottom: '-2px',
                color: isActive ? '#fff' : disabled ? 'var(--c-faint)' : 'var(--c-muted)',
                cursor: disabled ? 'default' : 'pointer',
                fontWeight: isActive ? 700 : 400,
                transition: 'background 0.12s, color 0.12s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {counts[key]} {label}
            </button>
          )
        })}
      </div>

      {/* Section intro */}
      <p style={{
        fontFamily: MONO,
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: activeSection.color,
        marginBottom: '16px',
      }}>
        {activeSection.intro}
      </p>

      <CardGrid
        repos={currentRepos}
        showCertLink={tab === 'dead' || tab === 'struggling'}
        accentColor={activeSection.color}
      />

      <p style={{ fontFamily: MONO, fontSize: '9px', color: 'var(--c-faint)', letterSpacing: '0.1em', textAlign: 'center', marginTop: '28px' }}>
        {repos.length} public repos · forks excluded
      </p>
    </div>
  )
}

function CardGrid({ repos, showCertLink, accentColor }: { repos: UserRepoSummary[]; showCertLink: boolean; accentColor: string }) {
  if (repos.length === 0) {
    return (
      <p style={{ fontFamily: MONO, fontSize: '11px', color: 'var(--c-muted)', letterSpacing: '0.06em', padding: '24px 0' }}>
        Nothing on record.
      </p>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: '10px',
    }}>
      {repos.map(r => (
        <RepoCard key={r.fullName} repo={r} showCertLink={showCertLink} accentColor={accentColor} />
      ))}
    </div>
  )
}

function RepoCard({ repo, showCertLink, accentColor }: { repo: UserRepoSummary; showCertLink?: boolean; accentColor: string }) {
  const name = repo.fullName.split('/')[1] ?? repo.fullName

  function formatDate(iso: string | null | undefined) {
    if (!iso) return 'no record'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '14px 16px 14px 14px',
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border-light)',
        borderLeft: `4px solid ${accentColor}`,
        minHeight: '140px',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-surface-raised)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-surface)' }}
    >
      {/* Repo name */}
      <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1.3, wordBreak: 'break-word' }}>
        {name}
      </span>

      {/* Cause */}
      {repo.cause && (
        <span style={{ fontFamily: SERIF, fontSize: '12px', fontStyle: 'italic', color: 'var(--c-ink-2)', lineHeight: 1.55, flex: 1 }}>
          {repo.cause}
        </span>
      )}

      {/* Last activity */}
      <span style={{ fontFamily: MONO, fontSize: '10px', color: 'var(--c-muted)', letterSpacing: '0.06em', marginTop: 'auto' }}>
        Last activity: {formatDate(repo.pushedAt)}
      </span>

      {/* Certify link */}
      {showCertLink && (
        <>
          <div style={{ width: '100%', height: '1px', background: 'var(--c-border-light)', marginTop: '6px' }} />
          <a
            href={`/?repo=${repo.fullName}`}
            style={{
              fontFamily: MONO,
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--c-muted)',
              textDecoration: 'none',
              padding: '6px 0 0',
              display: 'block',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-ink)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-muted)' }}
          >
            certify →
          </a>
        </>
      )}
    </div>
  )
}
