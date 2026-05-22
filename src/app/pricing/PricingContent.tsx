'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import SubpageShell from '@/components/SubpageShell'

const MONO = `var(--font-courier), system-ui, sans-serif`
const VALID_USERNAME = /^[a-zA-Z0-9_.-]+$/

type ParsedInput =
  | { kind: 'repo'; slug: string }
  | { kind: 'user'; username: string }
  | null

function parsePricingInput(value: string): ParsedInput {
  const trimmed = value.trim()
  if (!trimmed) return null

  const githubRepoUrl = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)(?:[/?#]|$)/i)
  if (githubRepoUrl) {
    const owner = githubRepoUrl[1]
    const repo = githubRepoUrl[2].replace(/\.git$/i, '')
    return { kind: 'repo', slug: `${owner}/${repo}` }
  }

  const githubUserUrl = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s?#]+)\/?$/i)
  if (githubUserUrl && VALID_USERNAME.test(githubUserUrl[1])) {
    return { kind: 'user', username: githubUserUrl[1] }
  }

  const slugMatch = trimmed.match(/^([^/\s]+)\/([^/\s]+)$/)
  if (slugMatch) {
    const owner = slugMatch[1]
    const repo = slugMatch[2].replace(/\.git$/i, '')
    return { kind: 'repo', slug: `${owner}/${repo}` }
  }

  if (VALID_USERNAME.test(trimmed)) {
    return { kind: 'user', username: trimmed }
  }

  return null
}

const SECTIONS = [
  {
    id: 'no-tiers',
    heading: 'No Tiers, No Trials, No Tricks',
    body: 'There is no Basic. There is no Pro. There is no Enterprise. Every funeral receives the same rites, the same paperwork, the same dignified treatment.',
  },
  {
    id: 'no-accounts',
    heading: 'No Account Required',
    body: 'You will not be asked for an email. You will not be asked to subscribe. The deceased never asked for credentials, and neither do we.',
  },
  {
    id: 'no-ads',
    heading: 'No Advertisements',
    body: 'No banners. No popups. No "sponsored by". The morgue is not a marketplace.',
  },
  {
    id: 'open-source',
    heading: 'Open Source Forever',
    body: 'The code is on GitHub under MIT license. Fork it. Self-host it. Improve it. The undertaker has no secrets.',
    github: true,
  },
  {
    id: 'how-we-survive',
    heading: 'How We Stay Alive',
    body: 'Commitment Issues is built and maintained by Dot Systems, an indie studio that funds this work from other projects. Fork it, share it, or open a pull request with new famous casualties. If you really want to chip in:',
    coffin: true,
  },
]

export default function PricingContent() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = parsePricingInput(value)
    if (!parsed) {
      setInvalid(true)
      return
    }
    track('pricing_repo_submitted', { kind: parsed.kind })
    if (parsed.kind === 'repo') {
      router.push(`/?repo=${encodeURIComponent(parsed.slug)}`)
    } else {
      router.push(`/user/${encodeURIComponent(parsed.username)}`)
    }
  }

  return (
    <SubpageShell
      title="Death Is Free."
      subtitle={
        <span style={{
          fontFamily: `var(--font-courier), system-ui, sans-serif`,
          fontSize: '12px',
          color: 'var(--c-muted)',
          letterSpacing: '0.04em',
        }}>
          So is this.
        </span>
      }
      microcopy={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map(({ id, heading, body, github, coffin }) => (
          <div
            key={id}
            className="record-card"
            style={{ border: '2px solid var(--c-border)' }}
          >
            <p className="record-label">{heading}</p>
            <p className="record-value" style={{ fontSize: 'clamp(14px, 3.8vw, 15px)', lineHeight: 1.75, color: 'var(--c-ink-2)' }}>
              {body}
            </p>
            {github && (
              <a
                href="https://github.com/dotsystemsdevs/commitmentissues"
                target="_blank"
                rel="noopener noreferrer"
                className="subpage-faq-cta"
                style={{ marginTop: '14px', display: 'inline-flex' }}
              >
                ★ View on GitHub
              </a>
            )}
            {coffin && (
              <a
                href="https://buymeacoffee.com/dotdevs"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('buy_me_a_coffin_clicked', { from: 'pricing' })}
                className="subpage-faq-cta"
                style={{ marginTop: '14px', display: 'inline-flex' }}
              >
                ⚰  Buy me a coffin →
              </a>
            )}
          </div>
        ))}

        <div
          className="record-card"
          style={{
            border: '2px solid var(--c-border)',
            background: 'var(--c-panel-2, transparent)',
            padding: '28px 20px',
            marginTop: '8px',
          }}
        >
          <p className="record-label" style={{ marginBottom: '14px', textAlign: 'center' }}>Begin the Examination</p>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input
              type="text"
              value={value}
              onChange={e => { setValue(e.target.value); if (invalid) setInvalid(false) }}
              placeholder="username or owner/repo"
              aria-label="GitHub username or repo"
              autoComplete="off"
              spellCheck={false}
              style={{
                fontFamily: MONO,
                fontSize: '14px',
                padding: '12px 14px',
                background: 'var(--c-bg)',
                color: 'var(--c-ink)',
                border: `2px solid ${invalid ? 'var(--c-red, #8B0000)' : 'var(--c-ink)'}`,
                outline: 'none',
                width: '100%',
                minHeight: '44px',
              }}
            />
            <button
              type="submit"
              className="subpage-faq-cta"
              style={{
                fontFamily: MONO,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                background: 'var(--c-ink)',
                color: 'var(--c-bg)',
                border: '2px solid var(--c-ink)',
                cursor: 'pointer',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ⚰  Issue death certificate →
            </button>
            {invalid && (
              <p style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--c-red, #8B0000)', margin: 0, textAlign: 'center' }}>
                Could not parse. Try a github URL or owner/repo.
              </p>
            )}
          </form>
        </div>
      </div>
    </SubpageShell>
  )
}
