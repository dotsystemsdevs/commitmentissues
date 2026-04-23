import Link from 'next/link'
import SubpageShell from '@/components/SubpageShell'

export default function NotFound() {
  return (
    <SubpageShell
      title="Record Not Found"
      subtitle="This burial does not appear to be on file."
      microcopy={null}
    >
      <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
        <Link href="/" className="subpage-faq-cta">
          return to the registry →
        </Link>
      </div>
    </SubpageShell>
  )
}
