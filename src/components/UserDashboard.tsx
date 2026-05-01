'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import type { UserRepoSummary } from '@/lib/types'
import ReadmeBadge from '@/components/ReadmeBadge'
import GitHubIcon from '@/components/GitHubIcon'

const MONO = `var(--font-courier), system-ui, sans-serif`

type Tab = 'dead' | 'struggling' | 'alive'

const SECTIONS = [
  {
    key: 'dead' as Tab,
    label: 'Dead',
    color: 'var(--c-red)',
    activeTextColor: 'var(--c-bg)',
    intro: 'Filed for permanent closure.',
  },
  {
    key: 'struggling' as Tab,
    label: 'Struggling',
    color: 'var(--c-amber)',
    activeTextColor: 'var(--c-bg)',
    intro: 'Active intervention recommended.',
  },
  {
    key: 'alive' as Tab,
    label: 'Alive',
    color: 'var(--c-green)',
    activeTextColor: 'var(--c-bg)',
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

      <ReadmeBadge username={username} />

      {/* Tab bar — minimal text tabs with colored accent underline */}
      <div className="user-dash-tabs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '18px' }}>
        {SECTIONS.flatMap(({ key, label, color }, i) => {
          const isActive = tab === key
          const disabled = counts[key] === 0
          const items = []
          if (i > 0) {
            items.push(<span key={`sep-${key}`} aria-hidden style={{ color: 'var(--c-border-light)', fontSize: '10px', userSelect: 'none' }}>✦</span>)
          }
          items.push(
            <button
              key={key}
              className="user-dash-tab-btn mode-tab"
              onClick={() => { if (!disabled) setTab(key) }}
              disabled={disabled}
              style={{
                color: isActive ? color : disabled ? 'var(--c-faint)' : 'var(--c-muted)',
                fontWeight: isActive ? 700 : 500,
                position: 'relative',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {counts[key]} {label}
              {isActive && (
                <span aria-hidden style={{ position: 'absolute', left: 14, right: 14, bottom: 2, height: 2, background: color }} />
              )}
            </button>
          )
          return items
        })}
      </div>

      <CardGrid
        repos={currentRepos}
        accentColor={activeSection.color}
        username={username}
      />

      <p style={{ fontFamily: MONO, fontSize: '10px', color: 'var(--c-faint)', letterSpacing: '0.1em', textAlign: 'center', marginTop: '28px' }}>
        {repos.length} public repos · forks excluded
      </p>
    </div>
  )
}

function CardGrid({ repos, accentColor, username }: { repos: UserRepoSummary[]; accentColor: string; username: string }) {
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '12px',
    }}>
      {repos.map(r => (
        <RepoCard key={r.fullName} repo={r} accentColor={accentColor} username={username} />
      ))}
    </div>
  )
}

function RepoCard({ repo, accentColor, username }: { repo: UserRepoSummary; accentColor: string; username: string }) {
  const name = repo.fullName.split('/')[1] ?? repo.fullName

  function formatDate(iso: string | null | undefined) {
    if (!iso) return 'no record'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const canCertify = repo.isDead || repo.isStruggling
  const cardStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '16px 18px',
    background: 'var(--c-surface)',
    border: '2px solid var(--c-border)',
    borderRadius: '0px',
    minHeight: '170px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    textDecoration: 'none',
    color: 'inherit',
    cursor: canCertify ? 'pointer' : 'default',
  }

  const inner = (
    <>
      {/* GitHub link — button to avoid nesting <a> inside <a> */}
      <button
        type="button"
        aria-label={`View ${repo.fullName} on GitHub`}
        title="View on GitHub"
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          window.open(`https://github.com/${repo.fullName}`, '_blank', 'noopener,noreferrer')
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: 'var(--c-muted)',
          cursor: 'pointer',
          transition: 'color 0.15s, transform 0.15s',
          zIndex: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-ink)'; e.currentTarget.style.transform = 'scale(1.12)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-muted)'; e.currentTarget.style.transform = 'scale(1)' }}
      >
        <GitHubIcon size={16} />
      </button>

      {/* Top row: status icon + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', paddingRight: '32px' }}>
        <span aria-hidden style={{
          fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '-1px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px',
          background: `radial-gradient(ellipse at 50% 85%, ${accentColor}33 0%, ${accentColor}18 45%, transparent 70%)`,
          borderRadius: '4px',
        }}>
          {repo.isDead ? '🪦' : repo.isStruggling ? '⚠' : '🌱'}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1.3, wordBreak: 'break-word', flex: 1, alignSelf: 'center' }}>
          {name}
        </span>
      </div>

      {/* Description */}
      {repo.description && (
        <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-ink)', opacity: 0.8, lineHeight: 1.5, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {repo.description}
        </span>
      )}

      {/* Cause (for dead/struggling) */}
      {repo.cause && (
        <span style={{ fontFamily: MONO, fontSize: '11px', fontStyle: 'italic', color: 'var(--c-muted)', lineHeight: 1.5, fontWeight: 400, flex: 1 }}>
          {repo.cause}
        </span>
      )}
      {!repo.cause && <span style={{ flex: 1 }} />}

      {/* Footer */}
      <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid var(--c-border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontFamily: MONO, fontSize: '10px', color: 'var(--c-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          last activity · <span style={{ color: 'var(--c-ink)', fontWeight: 600 }}>{formatDate(repo.pushedAt)}</span>
        </span>
        {canCertify && (
          <span
            style={{
              fontFamily: MONO,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--c-bg)',
              background: accentColor,
              padding: '8px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
              marginTop: '6px',
              border: `2px solid ${accentColor}`,
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            issue certificate →
          </span>
        )}
      </div>
    </>
  )

  if (canCertify) {
    return (
      <Link
        href={`/?repo=${repo.fullName}&from=${encodeURIComponent(username)}`}
        prefetch={false}
        className="alive-card"
        style={cardStyle}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div className="alive-card" style={cardStyle}>
      {inner}
    </div>
  )
}
