/**
 * Shared Halloween-window logic for server code that cannot read
 * `document.documentElement.dataset.halloween` (API routes, Satori images,
 * the SVG badge). Client components read the dataset attribute directly
 * (set by the inline script in layout.tsx) to avoid a hydration mismatch —
 * see src/components/HalloweenLayer.tsx.
 */
export function isHalloweenWindow(now: Date = new Date()): boolean {
  const iso = now.toISOString().slice(0, 10)
  return iso >= '2026-10-20' && iso <= '2026-11-02'
}

/**
 * Spooky causes of death, shown only in Halloween mode, layered on top of
 * (never replacing) the real scoring in scoring.ts. Picked deterministically
 * per repo so the same repo always gets the same one.
 */
export const SPOOKY_CAUSES: string[] = [
  'possessed by node_modules',
  'cursed by a merge conflict',
  'haunted by a TODO from 2019',
  'summoned by a dependabot PR at midnight',
  'bitten by a breaking change',
  'strangled by its own dependency tree',
  'dragged into the void by a silent rebase',
  'exorcised by a rage-quitting maintainer',
  'sacrificed to the CI pipeline',
  'raised, then re-buried by a failed migration',
]

export function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Deterministic pick: same repo full name always resolves to the same cause. */
export function pickSpookyCause(fullName: string): string {
  const index = hashString(fullName.toLowerCase()) % SPOOKY_CAUSES.length
  return SPOOKY_CAUSES[index]
}
