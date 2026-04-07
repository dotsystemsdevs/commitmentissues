import test from 'node:test'
import assert from 'node:assert/strict'
import { computeDeathIndex, generateLastWords } from './scoring'
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

test('inactive repo with many issues gets high death index', () => {
  const repo = buildRepo({
    lastCommitDate: '2018-01-01T00:00:00.000Z',
    openIssuesCount: 120,
    isArchived: false,
  })

  const score = computeDeathIndex(repo)
  assert.ok(score >= 5)
})

// ── generateLastWords ──────────────────────────────────────────────

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
