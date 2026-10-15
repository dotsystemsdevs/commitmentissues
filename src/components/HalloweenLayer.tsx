/**
 * Halloween edition, 20 Oct - 2 Nov. A fixed scene behind the page: moon, bats, a graveyard
 * hill with crosses, a bare tree and three jack-o'-lanterns. It is always rendered and only
 * shown when <html data-halloween> is set (see the inline script in layout.tsx), so there is
 * no hydration flash. Preview any day with ?halloween=1, turn it off with ?halloween=0.
 */
export default function HalloweenLayer() {
  return (
    <div className="hw-layer" aria-hidden>
      <div className="hw-sky" />
      <div className="hw-moon" />

      <svg className="hw-bats" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMin slice">
        {[
          [180, 120, 1], [260, 80, 0.7], [930, 150, 0.9], [1010, 95, 0.6], [640, 60, 0.5],
        ].map(([x, y, s], i) => (
          <g key={i} className={`hw-bat hw-bat-${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M0 0 C-8 -10 -22 -12 -34 -4 C-26 -4 -22 0 -20 6 C-14 0 -8 2 -4 8 L0 4 L4 8 C8 2 14 0 20 6 C22 0 26 -4 34 -4 C22 -12 8 -10 0 0 Z" />
          </g>
        ))}
      </svg>

      <svg className="hw-ground" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="hw-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb347" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* back hill */}
        <path className="hw-hill-back" d="M0 170 C150 120 300 150 450 135 C620 118 760 160 900 140 C1020 124 1120 135 1200 150 L1200 260 L0 260 Z" />
        {/* bare tree, left */}
        <path className="hw-sil" d="M140 175 L150 95 C130 80 112 70 96 58 M150 95 C160 75 176 60 196 52 M147 120 C128 112 116 104 104 100 M152 110 C170 104 184 96 192 86 M150 95 L153 175 Z" strokeWidth="7" stroke="currentColor" fill="none" strokeLinecap="round" />
        {/* crosses and tombstones */}
        <g className="hw-sil">
          <rect x="300" y="150" width="8" height="40" /><rect x="289" y="160" width="30" height="7" />
          <path d="M380 190 L380 160 C380 146 412 146 412 160 L412 190 Z" />
          <rect x="770" y="140" width="7" height="42" /><rect x="760" y="150" width="27" height="6" />
          <path d="M840 185 L840 158 C840 145 868 145 868 158 L868 185 Z" />
          <rect x="1050" y="148" width="8" height="40" /><rect x="1039" y="158" width="30" height="7" />
        </g>
        {/* front hill */}
        <path className="hw-hill-front" d="M0 210 C180 175 330 200 520 188 C720 176 880 210 1050 196 C1120 190 1170 194 1200 198 L1200 260 L0 260 Z" />
        {/* jack-o'-lanterns */}
        {[[470, 186, 1], [600, 192, 0.8], [990, 190, 0.9]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r="34" fill="url(#hw-glow)" className="hw-flicker" />
            <ellipse rx="20" ry="16" className="hw-pumpkin" />
            <rect x="-2" y="-21" width="4" height="7" rx="1" className="hw-stem" />
            <path d="M-11 -4 L-5 -4 L-8 -10 Z M5 -4 L11 -4 L8 -10 Z M-10 4 L-6 8 L-2 4 L2 8 L6 4 L10 4 L6 10 L-6 10 Z" className="hw-face" />
          </g>
        ))}
      </svg>

      <div className="hw-fog" />
    </div>
  )
}
