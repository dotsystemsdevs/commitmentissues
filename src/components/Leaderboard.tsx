'use client'


import { LeaderboardEntry } from '@/lib/types'

const HALL_OF_SHAME: LeaderboardEntry[] = [
  { fullName: 'atom/atom',              cause: 'GitHub built VS Code and forgot this existed',               score: 10, deathDate: 'Dec 2022' },
  { fullName: 'angularjs/angular.js',   cause: 'Angular 2 murdered its own parent in cold blood',            score: 9,  deathDate: 'Jan 2022' },
  { fullName: 'adobe/brackets',         cause: 'Adobe discovered VS Code already existed',                   score: 10, deathDate: 'Sep 2021' },
  { fullName: 'apache/cordova',         cause: 'React Native showed up and everyone switched mid-project',   score: 8,  deathDate: 'Aug 2020' },
  { fullName: 'gulpjs/gulp',            cause: 'Webpack arrived. Then Vite. Poor Gulp.',                     score: 8,  deathDate: 'Dec 2019' },
  { fullName: 'meteor/meteor',          cause: 'Promised full-stack bliss. Delivered full-stack confusion.',  score: 7,  deathDate: 'Jun 2018' },
  { fullName: 'ariya/phantomjs',        cause: 'Chrome went headless. This went nowhere.',                   score: 9,  deathDate: 'Mar 2018' },
  { fullName: 'bower/bower',            cause: 'npm install happened and nobody looked back',                score: 9,  deathDate: 'Jan 2017' },
  { fullName: 'facebook/flux',          cause: 'Redux arrived uninvited and never left',                     score: 9,  deathDate: 'Oct 2016' },
  { fullName: 'gruntjs/grunt',          cause: 'Gulped by Gulp, then Webpacked into the grave',              score: 8,  deathDate: 'Feb 2016' },
  { fullName: 'mootools/mootools-core', cause: 'jQuery killed it softly. Then jQuery died too.',             score: 7,  deathDate: 'Jan 2016' },
  { fullName: 'ftlabs/fastclick',       cause: 'The 300ms delay got fixed. So did this.',                   score: 8,  deathDate: 'Nov 2015' },
  { fullName: 'microsoft/winjs',        cause: 'Windows Phone died and took everything with it',             score: 10, deathDate: 'Sep 2015' },
  { fullName: 'jashkenas/coffeescript', cause: 'ES6 stole all its ideas and left',                          score: 7,  deathDate: 'Sep 2015' },
  { fullName: 'knockout/knockout',      cause: 'Vue arrived and everyone forgot their vows',                 score: 8,  deathDate: 'Oct 2015' },
  { fullName: 'jashkenas/backbone',     cause: 'The framework React made everyone forget',                   score: 7,  deathDate: 'Apr 2014' },
  { fullName: 'google/closure-library', cause: 'Google moved on. They always move on.',                     score: 8,  deathDate: 'Feb 2022' },
  { fullName: 'yahoo/mojito',           cause: 'Yahoo happened',                                            score: 9,  deathDate: 'Mar 2014' },
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
    <div style={{ fontFamily: FONT, width: '100%', border: `1.5px solid ${C_LIGHT}`, borderRadius: '10px', overflow: 'hidden' }}>

      {/* Table */}
      <div className="lb-table" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {/* Commit bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '9px 16px',
          background: '#ebebeb',
          borderBottom: `1.5px solid ${C_LIGHT}`,
          minWidth: '520px',
        }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', lineHeight: 1 }}>💀</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C_DARKEST }}>the_grim_reaper</span>
          <span style={{ fontSize: '13px', fontStyle: 'italic', color: C_WARM_GR, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {'chore: collect souls and close issues permanently'}
          </span>
          <span style={{ fontSize: '12px', fontStyle: 'italic', color: C_WARM_GR, whiteSpace: 'nowrap' }}>eternally ago</span>
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
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              width: '100%',
              minWidth: '520px',
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
              e.currentTarget.style.borderLeftColor = '#8b0000'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderLeftColor = 'transparent'
            }}
          >
            {/* Header: tombstone + name + date */}
            <div className="lb-row-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '17px', flexShrink: 0, lineHeight: '1.4', marginTop: '1px' }}>🪦</span>

              <span className="lb-name" style={{
                fontFamily: FONT,
                fontSize: '15px',
                fontWeight: 700,
                color: '#8b0000',
                whiteSpace: 'nowrap',
                width: '190px',
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.5',
              }}>
                {entry.fullName}
              </span>

              {/* Cause — desktop: inline after name */}
              <span className="lb-cause-desktop" style={{
                fontFamily: FONT,
                fontSize: '15px',
                fontStyle: 'italic',
                color: C_WARM_GR,
                flex: 1,
                minWidth: 0,
                lineHeight: '1.5',
              }}>
                {entry.cause}
              </span>

              <span className="lb-date" style={{
                fontFamily: FONT,
                fontSize: '13px',
                color: C_DARK,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                lineHeight: '1.5',
                marginTop: '2px',
              }}>
                {entry.deathDate ?? ''}
              </span>
            </div>

            {/* Cause — mobile: below name */}
            <span className="lb-cause-mobile" style={{
              display: 'none',
              fontFamily: FONT,
              fontSize: '14px',
              fontStyle: 'italic',
              color: C_WARM_GR,
              lineHeight: '1.5',
              paddingLeft: '28px',
            }}>
              {entry.cause}
            </span>
          </button>
          </div>
        ))}
      </div>
    </div>
  )
}
