'use client'

import { track } from '@vercel/analytics'
import { LeaderboardEntry } from '@/lib/types'

const HALL_OF_SHAME: LeaderboardEntry[] = [
  { fullName: 'atom/atom',              cause: 'GitHub built VS Code and forgot this existed',               score: 10, deathDate: 'Dec 2022', lastWords: 'At least I had good themes.' },
  { fullName: 'angularjs/angular.js',   cause: 'Angular 2 murdered its own parent in cold blood',            score: 9,  deathDate: 'Jan 2022', lastWords: 'They named the replacement Angular too. Nobody was fooled.' },
  { fullName: 'adobe/brackets',         cause: 'Adobe discovered VS Code already existed',                   score: 10, deathDate: 'Sep 2021', lastWords: 'I was actually pretty good. Nobody will know.' },
  { fullName: 'apache/cordova',         cause: 'React Native showed up and everyone switched mid-project',   score: 8,  deathDate: 'Aug 2020', lastWords: 'Hybrid apps were a mistake. I was a mistake.' },
  { fullName: 'gulpjs/gulp',            cause: 'Webpack arrived. Then Vite. Poor Gulp.',                     score: 8,  deathDate: 'Dec 2019', lastWords: 'I streamed data beautifully. Nobody cared.' },
  { fullName: 'meteor/meteor',          cause: 'Promised full-stack bliss. Delivered full-stack confusion.',  score: 7,  deathDate: 'Jun 2018', lastWords: 'I promised real-time. I delivered real pain.' },
  { fullName: 'ariya/phantomjs',        cause: 'Chrome went headless. This went nowhere.',                   score: 9,  deathDate: 'Mar 2018', lastWords: 'I had a headless future. Then so did Chrome.' },
  { fullName: 'bower/bower',            cause: 'npm install happened and nobody looked back',                score: 9,  deathDate: 'Jan 2017', lastWords: 'bower_components. That\'s my legacy.' },
  { fullName: 'facebook/flux',          cause: 'Redux arrived uninvited and never left',                     score: 9,  deathDate: 'Oct 2016', lastWords: 'I was just unidirectional data flow. Redux was also just unidirectional data flow.' },
  { fullName: 'gruntjs/grunt',          cause: 'Gulped by Gulp, then Webpacked into the grave',              score: 8,  deathDate: 'Feb 2016', lastWords: 'Gruntfile.js was 300 lines. That was the problem.' },
  { fullName: 'mootools/mootools-core', cause: 'jQuery killed it softly. Then jQuery died too.',             score: 7,  deathDate: 'Jan 2016', lastWords: 'I prototyped everything. Even things that shouldn\'t be prototyped.' },
  { fullName: 'ftlabs/fastclick',       cause: 'The 300ms delay got fixed. So did this.',                   score: 8,  deathDate: 'Nov 2015', lastWords: 'My entire purpose was 300ms. Mobile browsers fixed it. Nobody told me.' },
  { fullName: 'microsoft/winjs',        cause: 'Windows Phone died and took everything with it',             score: 10, deathDate: 'Sep 2015', lastWords: 'Windows Phone had 3% market share. I had 3% of that.' },
  { fullName: 'jashkenas/coffeescript', cause: 'ES6 stole all its ideas and left',                          score: 7,  deathDate: 'Sep 2015', lastWords: 'I made JavaScript beautiful. JavaScript made me irrelevant.' },
  { fullName: 'knockout/knockout',      cause: 'Vue arrived and everyone forgot their vows',                 score: 8,  deathDate: 'Oct 2015', lastWords: 'ko.observable. ko.computed. ko.gone.' },
]

const FONT = `var(--font-dm), -apple-system, sans-serif`

interface Props {
  onSelect: (url: string) => void
}

function RepoCard({ entry, onSelect }: { entry: LeaderboardEntry; onSelect: (url: string) => void }) {
  return (
    <button
      onClick={() => { track('graveyard_clicked', { repo: entry.fullName }); onSelect(`https://github.com/${entry.fullName}`) }}
      className="graveyard-card"
      style={{
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '20px',
        background: '#fff',
        border: '1.5px solid #d8d4d0',
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#0a0a0a'
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#d8d4d0'
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
      }}
    >
      <span style={{ fontSize: '22px', lineHeight: 1 }}>🪦</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3, wordBreak: 'break-word' }}>
        {entry.fullName}
      </span>
      <span style={{ fontSize: '13px', fontStyle: 'italic', color: '#938882', lineHeight: 1.5 }}>
        {entry.cause}
      </span>
      <span style={{ fontSize: '11px', color: '#b0aca8', marginTop: '2px' }}>
        {entry.deathDate}
      </span>
    </button>
  )
}

export default function Leaderboard({ onSelect }: Props) {
  return (
    <>
      {/* Mobile: horizontal snap scroll with fade */}
      <div className="graveyard-mobile" style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '8px',
          msOverflowStyle: 'none',
        }}>
          {HALL_OF_SHAME.map((entry, i) => (
            <div key={i} style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '280px' }}>
              <RepoCard entry={entry} onSelect={onSelect} />
            </div>
          ))}
          {/* Partial ghost card to signal more content */}
          <div style={{ flexShrink: 0, width: '40px' }} />
        </div>
        {/* Fade-out right edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 8,
          width: '60px',
          background: 'linear-gradient(to right, transparent, #f5f5f5)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Desktop: grid */}
      <div className="graveyard-desktop" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        {HALL_OF_SHAME.map((entry, i) => (
          <RepoCard key={i} entry={entry} onSelect={onSelect} />
        ))}
      </div>
    </>
  )
}
