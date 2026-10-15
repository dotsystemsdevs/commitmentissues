'use client'

import { track } from '@vercel/analytics'
import { useEffect, useState } from 'react'

type Props = {
  repo: string
}

const PINEFLOW_URL = (repo: string) =>
  `https://stackpine.app/pineflow?ref=commitmentissues&utm_source=commitmentissues&utm_medium=certificate&utm_content=${encodeURIComponent(repo)}`

/** "Raise it from the dead" — Pineflow cross-sell shown on every certificate. */
export default function ResurrectCard({ repo }: Props) {
  const [halloween, setHalloween] = useState(false)

  useEffect(() => {
    setHalloween(document.documentElement.dataset.halloween === '1')
  }, [])

  return (
    <section className="resurrect-card" aria-labelledby="resurrect-title">
      <div className="resurrect-card-kicker">
        <span aria-hidden>{halloween ? '🧟' : '☥'}</span>
        Raise it from the dead{halloween ? ' 🧟' : ''}?
      </div>
      <h2 id="resurrect-title" className="resurrect-card-title">
        Pineflow: a free step-by-step workflow to finally ship it.
      </h2>
      <p className="resurrect-card-copy">
        Stop letting repos die in the commit graveyard. Pineflow walks you from idea to shipped app, one phase at a time.
      </p>
      <a
        href={PINEFLOW_URL(repo)}
        target="_blank"
        rel="noopener noreferrer"
        className="resurrect-card-button"
        onClick={() => track('pineflow_clicked', { repo })}
      >
        <span>Try Pineflow</span>
        <span aria-hidden>↗</span>
      </a>
      <p className="resurrect-card-note">Free. No account required.</p>
    </section>
  )
}
