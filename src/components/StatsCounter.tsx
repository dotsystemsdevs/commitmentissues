'use client'

const MONO = `var(--font-courier), system-ui, sans-serif`

const RepoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
  </svg>
)

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
  </svg>
)

const DIGIT_WIDTH = 18
const DIGIT_HEIGHT = 24
const MIN_DIGITS = 4

function Digit({ d }: { d: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${DIGIT_WIDTH}px`,
      height: `${DIGIT_HEIGHT}px`,
      background: '#1a1a1a',
      color: '#EDE8E1',
      fontFamily: MONO,
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: 1,
      borderRight: '1px solid rgba(255,255,255,0.12)',
    }}>
      {d}
    </span>
  )
}

function Counter({ value }: { value: number }) {
  const raw = Math.max(0, Math.floor(value)).toString()
  const digits = raw.padStart(Math.max(MIN_DIGITS, raw.length), '0').split('')
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden' }}>
      {digits.map((d, i) => (
        <span key={i} style={{ borderRight: i === digits.length - 1 ? 'none' : undefined }}>
          <Digit d={d} />
        </span>
      ))}
    </span>
  )
}

interface Props {
  buried: number
  profiles: number
}

export default function StatsCounter({ buried, profiles }: Props) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      flexWrap: 'wrap',
      fontFamily: MONO,
      minHeight: '24px',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1a1a1a' }}>
        <RepoIcon />
        <Counter value={buried} />
      </span>

      <span aria-hidden style={{ color: '#cec6bb', fontSize: '10px' }}>✦</span>

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1a1a1a' }}>
        <PersonIcon />
        <Counter value={profiles} />
      </span>
    </div>
  )
}
