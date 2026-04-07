import test from 'node:test'
import assert from 'node:assert/strict'
import {
  computeDeathIndex,
  getDeathLabel,
  determineCauseOfDeath,
  generateLastWords,
  computeAge,
  formatDate,
} from './scoring'
import type { RepoData } from './types'

function buildRepo(overrides: Partial<RepoData> = {}): RepoData {
  return {
    fullName: 'example/dead-repo',
    name: 'dead-repo',
    description: 'old side project',
    createdAt: '2017-01-01T00:00:00.000Z',
    pushedAt: '2018-01-01T00:00:00.000Z',
    lastCommitDate: '2018-01-01T00:00:00.000Z',
    lastCommitMessage: 'final commit',
    commitCount: 12,
    language: 'TypeScript',
    isArchived: false,
    isFork: false,
    openIssuesCount: 120,
    stargazersCount: 42,
    forksCount: 10,
    topics: [],
    ...overrides,
  }
}

// ── computeDeathIndex ──────────────────────────────────────────────

test('inactive repo with many issues gets high death index', () => {
  const repo = buildRepo({
    lastCommitDate: '2018-01-01T00:00:00.000Z',
    openIssuesCount: 120,
    isArchived: false,
  })
  const score = computeDeathIndex(repo)
  assert.ok(score >= 5)
})

test('archived repo gets high score', () => {
  const repo = buildRepo({ isArchived: true })
  const score = computeDeathIndex(repo)
  assert.ok(score >= 3, `expected >= 3, got ${score}`)
})

test('repo with last commit today returns 0', () => {
  const repo = buildRepo({
    lastCommitDate: new Date().toISOString(),
    openIssuesCount: 0,
    stargazersCount: 0,
    isArchived: false,
  })
  const score = computeDeathIndex(repo)
  assert.equal(score, 0)
})

test('repo with 1000+ open issues and no recent commits scores very high', () => {
  const repo = buildRepo({
    lastCommitDate: '2015-01-01T00:00:00.000Z',
    openIssuesCount: 1500,
    stargazersCount: 500,
    isArchived: true,
  })
  const score = computeDeathIndex(repo)
  assert.ok(score >= 9, `expected >= 9, got ${score}`)
})

test('commit 200 days ago with low issues scores modestly', () => {
  const d = new Date()
  d.setDate(d.getDate() - 200)
  const repo = buildRepo({
    lastCommitDate: d.toISOString(),
    openIssuesCount: 5,
    stargazersCount: 10,
    isArchived: false,
  })
  const score = computeDeathIndex(repo)
  assert.equal(score, 1)
})

// ── getDeathLabel ──────────────────────────────────────────────────

test('getDeathLabel returns correct labels at boundaries', () => {
  assert.equal(getDeathLabel(0), 'too soon to tell')
  assert.equal(getDeathLabel(2), 'too soon to tell')
  assert.equal(getDeathLabel(3), 'struggling')
  assert.equal(getDeathLabel(5), 'struggling')
  assert.equal(getDeathLabel(6), 'dying')
  assert.equal(getDeathLabel(8), 'dying')
  assert.equal(getDeathLabel(9), 'dead dead')
  assert.equal(getDeathLabel(10), 'dead dead')
})

// ── determineCauseOfDeath ──────────────────────────────────────────

test('known repo (atom/atom) returns exact known cause', () => {
  const repo = buildRepo({ fullName: 'atom/atom' })
  const cause = determineCauseOfDeath(repo)
  assert.equal(cause, 'GitHub shipped VS Code, then sunset Atom in public')
})

test('fork repo returns "Forked but never understood"', () => {
  const d = new Date()
  d.setDate(d.getDate() - 100)
  const repo = buildRepo({
    isFork: true,
    isArchived: false,
    lastCommitDate: d.toISOString(),
    openIssuesCount: 0,
    stargazersCount: 0,
    description: 'some fork',
  })
  const cause = determineCauseOfDeath(repo)
  assert.equal(cause, 'Forked but never understood')
})

test('no description returns "No README. No hope."', () => {
  const d = new Date()
  d.setDate(d.getDate() - 100)
  const repo = buildRepo({
    description: null,
    isFork: false,
    isArchived: false,
    lastCommitDate: d.toISOString(),
    openIssuesCount: 0,
    stargazersCount: 0,
  })
  const cause = determineCauseOfDeath(repo)
  assert.equal(cause, 'No README. No hope.')
})

test('archived repo returns "Officially declared dead by author"', () => {
  const repo = buildRepo({ isArchived: true })
  const cause = determineCauseOfDeath(repo)
  assert.equal(cause, 'Officially declared dead by author')
})

test('commitmentissues repo returns its own easter egg cause', () => {
  const repo = buildRepo({ fullName: 'dotsystemsdevs/commitmentissues' })
  const cause = determineCauseOfDeath(repo)
  assert.equal(cause, 'Monetized before loved.')
})

// ── generateLastWords ──────────────────────────────────────────────

test('commit message with "fix typo" returns "pls work now"', () => {
  const repo = buildRepo({ lastCommitMessage: 'fix typo in header' })
  assert.equal(generateLastWords(repo), 'pls work now')
})

test('commit message with "update readme" returns docs quip', () => {
  const repo = buildRepo({ lastCommitMessage: 'update readme with badges' })
  assert.equal(generateLastWords(repo), 'at least the docs are good')
})

test('commit message with "wip" returns "i\'ll finish this later"', () => {
  const repo = buildRepo({
    lastCommitMessage: 'wip: refactor auth module',
    lastCommitDate: new Date().toISOString(),
  })
  assert.equal(generateLastWords(repo), "i'll finish this later")
})

test('commit message with "merge" returns merge conflict quip', () => {
  const repo = buildRepo({
    lastCommitMessage: 'Merge pull request #42',
    lastCommitDate: new Date().toISOString(),
  })
  assert.equal(generateLastWords(repo), 'dying in a merge conflict')
})

test('very long commit message is truncated to 80 chars', () => {
  const longMsg = 'a'.repeat(120)
  const repo = buildRepo({
    lastCommitMessage: longMsg,
    lastCommitDate: new Date().toISOString(),
  })
  const words = generateLastWords(repo)
  assert.ok(words.length <= 80, `expected <= 80, got ${words.length}`)
  assert.ok(words.endsWith('...'))
})

test('commitmentissues repo returns its own easter egg last words', () => {
  const repo = buildRepo({ fullName: 'dotsystemsdevs/commitmentissues' })
  assert.equal(generateLastWords(repo), "should've farmed laughs before revenue.")
})

// ── computeAge ─────────────────────────────────────────────────────

test('same month created and last commit returns "less than a month"', () => {
  assert.equal(computeAge('2024-03-15T00:00:00Z', '2024-03-28T00:00:00Z'), 'less than a month')
})

test('exactly 1 year returns "1 year"', () => {
  assert.equal(computeAge('2023-01-01T00:00:00Z', '2024-01-01T00:00:00Z'), '1 year')
})

test('2 years 3 months returns "2 years, 3 months"', () => {
  assert.equal(computeAge('2020-01-01T00:00:00Z', '2022-04-01T00:00:00Z'), '2 years, 3 months')
})

test('11 months returns "11 months"', () => {
  assert.equal(computeAge('2023-01-01T00:00:00Z', '2023-12-01T00:00:00Z'), '11 months')
})

test('1 month returns "1 month" (singular)', () => {
  assert.equal(computeAge('2024-01-01T00:00:00Z', '2024-02-01T00:00:00Z'), '1 month')
})

// ── formatDate ─────────────────────────────────────────────────────

test('formatDate returns en-GB formatted date', () => {
  const result = formatDate('2024-06-15T12:00:00Z')
  assert.ok(result.includes('June'), `expected "June" in "${result}"`)
  assert.ok(result.includes('2024'), `expected "2024" in "${result}"`)
})

// ── generateLastWords (expanded patterns) ─────────────────────────

test('"initial commit" returns beginning quote', () => {
  const repo = buildRepo({ lastCommitMessage: 'initial commit', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'it was only ever the beginning')
})

test('"revert" returns nevermind', () => {
  const repo = buildRepo({ lastCommitMessage: 'revert: undo migration', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'nevermind')
})

test('"hotfix" returns this is fine', () => {
  const repo = buildRepo({ lastCommitMessage: 'hotfix: patch auth flow', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'this is fine')
})

test('"cleanup" returns tidying quote', () => {
  const repo = buildRepo({ lastCommitMessage: 'cleanup unused imports', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'just tidying up before i go')
})

test('"bump version" returns release quote', () => {
  const repo = buildRepo({ lastCommitMessage: 'bump version to 3.0.0', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'one last release into the void')
})

test('"remove" returns burning the evidence', () => {
  const repo = buildRepo({ lastCommitMessage: 'remove deprecated API', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'burning the evidence')
})

test('"refactor" returns architecture quote', () => {
  const repo = buildRepo({ lastCommitMessage: 'refactor auth module', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'i swear this time the architecture is right')
})

test('"todo" returns someone else quote', () => {
  const repo = buildRepo({ lastCommitMessage: 'add todo for error handling', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'someone else will handle it')
})

test('"dependencies" returns dependency hell', () => {
  const repo = buildRepo({ lastCommitMessage: 'update dependencies', lastCommitDate: new Date().toISOString() })
  assert.equal(generateLastWords(repo), 'trapped in dependency hell')
})
