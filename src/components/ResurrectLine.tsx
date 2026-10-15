'use client'

import { track } from '@vercel/analytics'

type Props = {
  username: string
}

const PINEFLOW_URL = (username: string) =>
  `https://stackpine.app/pineflow?ref=commitmentissues&utm_source=commitmentissues&utm_medium=graveyard_report&utm_content=${encodeURIComponent(username)}`

/** Quiet one-line Pineflow mention under a profile graveyard report. */
export default function ResurrectLine({ username }: Props) {
  return (
    <p className="resurrect-line">
      Got a few of these yourself?
      <a
        href={PINEFLOW_URL(username)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('pineflow_clicked', { repo: `profile:${username}` })}
      >
        Pineflow
      </a>
      can help you actually ship one.
    </p>
  )
}
