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
  { fullName: 'nicowillis/ratchet',     cause: 'Bootstrap Mobile never shipped. Neither did this.',           score: 7,  deathDate: 'Aug 2015', lastWords: 'I was mobile-first before mobile-first was cool. Then I wasn\'t.' },
  { fullName: 'adobe/phonegap',         cause: 'Cordova forked it. React Native buried them both.',           score: 8,  deathDate: 'Oct 2020', lastWords: 'I was Cordova before Cordova. Nobody remembers.' },
  { fullName: 'postcss/autoprefixer',   cause: 'Browsers finally agreed on things. Took them long enough.',   score: 7,  deathDate: 'Jan 2023', lastWords: 'I added -webkit- to everything. Even things that didn\'t need it.' },
  { fullName: 'joyent/node',            cause: 'io.js forked it, then everyone made up and pretended nothing happened', score: 7, deathDate: 'May 2015', lastWords: 'The fork was mostly about a callback style disagreement. We don\'t talk about it.' },
  { fullName: 'twbs/ratchet',           cause: 'Nobody actually built apps with Bootstrap anyway',            score: 6,  deathDate: 'Mar 2016', lastWords: 'I had 11,000 stars. Zero shipped apps.' },
  { fullName: 'mattdesl/budo',          cause: 'Webpack devServer ate the entire category',                   score: 6,  deathDate: 'Feb 2018', lastWords: 'browserify was already losing. I never stood a chance.' },
  { fullName: 'strongloop/loopback',    cause: 'Express stayed simple. This did not.',                        score: 7,  deathDate: 'Jun 2019', lastWords: 'I had a visual API composer. I thought that was good.' },
  { fullName: 'yahoo/mojito',           cause: 'Yahoo slowly forgot it existed, then forgot everything else', score: 9,  deathDate: 'Dec 2014', lastWords: 'I was isomorphic JavaScript in 2012. Too early. Also Yahoo.' },
  { fullName: 'dojo/dojo',             cause: 'jQuery won the 2008 framework wars. Dojo was not informed.',   score: 8,  deathDate: 'Dec 2021', lastWords: 'I had AMD modules before AMD was a thing. Nobody used them.' },
  { fullName: 'Polymer/polymer',        cause: 'Web Components were supposed to be the future. They were not.', score: 8, deathDate: 'Apr 2021', lastWords: 'HTML Imports. I thought that was a good idea. It was not.' },
  { fullName: 'tencent/wepy',           cause: 'WeChat\'s own framework killed its own ecosystem',            score: 7,  deathDate: 'Nov 2019', lastWords: 'Even Tencent forgot about me.' },
  { fullName: 'marionettejs/backbone.marionette', cause: 'Backbone died. So did everything built on Backbone.', score: 8, deathDate: 'Mar 2020', lastWords: 'I was Backbone but organized. Backbone wasn\'t organized. Or alive.' },
  { fullName: 'mikeal/request',         cause: 'fetch() shipped natively and deprecated an entire generation', score: 9, deathDate: 'Feb 2020', lastWords: 'I was downloaded 30 million times a week. Then fetch happened.' },
  { fullName: 'nicolo-ribaudo/jest-light-runner', cause: 'Vitest arrived and made everyone feel bad about Jest', score: 6, deathDate: 'Jan 2023', lastWords: 'I was faster Jest. Vitest was even faster. Also had a UI.' },
]

const FONT = `var(--font-dm), -apple-system, sans-serif`

interface Props {
  onSelect: (url: string) => void
}

export default function Leaderboard({ onSelect }: Props) {
  function GraveyardCard({ entry }: { entry: LeaderboardEntry }) {
    return (
      <button
        type="button"
        onClick={() => { track('graveyard_clicked', { repo: entry.fullName }); onSelect(`https://github.com/${entry.fullName}`) }}
        style={{
          fontFamily: FONT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6px',
          width: '296px',
          minHeight: '184px',
          flexShrink: 0,
          padding: '20px',
          background: '#f2f2f2',
          border: '2px solid #8c8c8c',
          borderRadius: '0px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-color 0.15s, box-shadow 0.15s, opacity 0.12s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#0a0a0a'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#8c8c8c'
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
        }}
        onMouseDown={e => {
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseUp={e => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        <span style={{ fontSize: '20px', lineHeight: 1 }}>🪦</span>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.3, wordBreak: 'break-word' }}>
          {entry.fullName}
        </span>
        <span style={{ fontSize: '14px', fontStyle: 'italic', color: '#4d4d4d', lineHeight: 1.6, fontWeight: 500, marginTop: '2px' }}>
          {entry.cause}
        </span>
        <span style={{ fontSize: '12px', color: '#787878', marginTop: '4px' }}>
          {entry.deathDate}
        </span>
      </button>
    )
  }

  return (
    <div
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', overflow: 'hidden', padding: '4px 20px 8px', scrollPaddingInline: '20px' }}
      onMouseEnter={e => { (e.currentTarget.querySelector('.marquee-track') as HTMLElement).style.animationPlayState = 'paused' }}
      onMouseLeave={e => { (e.currentTarget.querySelector('.marquee-track') as HTMLElement).style.animationPlayState = 'running' }}
    >
      <div className="marquee-track" style={{
        display: 'flex',
        gap: '14px',
        animation: 'marquee 120s linear infinite',
        width: 'max-content',
      }}>
        {HALL_OF_SHAME.map((entry) => (
          <GraveyardCard key={entry.fullName} entry={entry} />
        ))}
        <div aria-hidden style={{ display: 'contents' }}>
          {HALL_OF_SHAME.map((entry) => (
            <GraveyardCard key={`loop-${entry.fullName}`} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  )
}
