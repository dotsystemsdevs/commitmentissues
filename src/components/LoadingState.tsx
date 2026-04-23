'use client'

const MONO = `var(--font-courier), system-ui, sans-serif`

interface Props {
  primary?: string
  secondary?: string
}

export default function LoadingState({ primary = 'reviewing case files...', secondary = 'assembling the record' }: Props) {
  return (
    <div style={{ width: '100%', minHeight: '160px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '6px' }}>
      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
        <span className="loading-dot" style={{ animationDelay: '0s' }} />
        <span className="loading-dot" style={{ animationDelay: '0.15s' }} />
        <span className="loading-dot" style={{ animationDelay: '0.3s' }} />
      </div>
      <p style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 600, color: '#160A06', margin: 0 }}>
        {primary}
      </p>
      <p style={{ fontFamily: MONO, fontSize: '10px', color: '#b0aca8', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
        {secondary}
      </p>
    </div>
  )
}
