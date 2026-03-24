type TombstoneIconProps = {
  size?: number
  className?: string
}

export default function TombstoneIcon({ size = 64, className }: TombstoneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect x="16" y="12" width="32" height="40" rx="16" fill="#D8D3CD" stroke="#1A0F06" strokeWidth="2.5" />
      <rect x="22" y="48" width="20" height="8" rx="2" fill="#C6BFB7" stroke="#1A0F06" strokeWidth="2" />
      <path d="M32 22V36" stroke="#6E6359" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 29H39" stroke="#6E6359" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
