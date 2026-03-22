'use client'


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
const C_WARM_GR = '#555555'
const C_LIGHT   = '#c8c8c8'
const C_DARK    = '#222222'
const C_DARKEST = '#111111'


interface Props {
  onSelect: (url: string) => void
}

export default function Leaderboard({ onSelect }: Props) {
  const list = HALL_OF_SHAME

  return (
    <div style={{ fontFamily: FONT, width: '100%', border: `1.5px solid ${C_LIGHT}`, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

      <div className="lb-scroll">
      {/* Table */}
      <div className="lb-table">

        {/* Commit bar */}
        <div className="lb-commit-bar" style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '9px 16px',
          background: '#ebebeb',
          borderBottom: `1.5px solid ${C_LIGHT}`,
        }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', lineHeight: 1 }}>💀</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C_DARKEST }}>the_grim_reaper</span>
          <span className="lb-commit-msg" style={{ fontSize: '13px', fontStyle: 'italic', color: C_WARM_GR, flex: '1 1 160px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {'chore: collect souls and close issues permanently'}
          </span>
        </div>

        {list.length === 0 ? (
          <div style={{ padding: '56px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🪦</div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C_DARK, marginBottom: '6px' }}>No repos buried yet</p>
            <p style={{ fontSize: '14px', fontStyle: 'italic', color: C_WARM_GR }}>Paste a GitHub URL above to issue your first death certificate.</p>
          </div>
        ) : list.map((entry, i) => (
          <div key={entry.fullName + i} style={{ position: 'relative' }}>
            {i !== 0 && <div style={{ height: '1px', background: C_LIGHT, margin: '0' }} />}
            <button
            className="lb-row"
            onClick={() => onSelect(`https://github.com/${entry.fullName}`)}
            style={{
              display: 'grid',
              alignItems: 'start',
              columnGap: '14px',
              rowGap: '6px',
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderLeft: '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.12s, border-left-color 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f0f0f0'
              e.currentTarget.style.borderLeftColor = '#0a0a0a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderLeftColor = 'transparent'
            }}
          >
            <span className="lb-icon" style={{ fontSize: '17px', lineHeight: '1.4', marginTop: '1px' }}>🪦</span>

            <span className="lb-name" style={{
              fontFamily: FONT,
              fontSize: '15px',
              fontWeight: 700,
              color: '#0a0a0a',
              lineHeight: '1.5',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {entry.fullName}
            </span>

            <div className="lb-cause" style={{ minWidth: 0 }}>
              <span style={{
                fontFamily: FONT,
                fontSize: '15px',
                fontStyle: 'italic',
                color: C_WARM_GR,
                lineHeight: '1.5',
                display: 'block',
              }}>
                {entry.cause}
              </span>
            </div>

            <span className="lb-date" style={{
              fontFamily: FONT,
              fontSize: '13px',
              color: C_DARK,
              lineHeight: '1.5',
              marginTop: '2px',
              whiteSpace: 'nowrap',
            }}>
              {entry.deathDate ?? ''}
            </span>
          </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
