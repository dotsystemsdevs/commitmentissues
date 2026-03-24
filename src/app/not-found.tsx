import SubpageShell from '@/components/SubpageShell'

export default function NotFound() {
  return (
    <SubpageShell
      title="404"
      subtitle="This page is more dead than the repos we bury."
      microcopy={null}
    >
      <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
        <p style={{
          fontFamily: `var(--font-courier), 'Courier New', monospace`,
          fontSize: '13px',
          color: '#b0aca8',
          letterSpacing: '0.04em',
        }}>
          Nothing here. Not even a last commit.
        </p>
      </div>
    </SubpageShell>
  )
}
