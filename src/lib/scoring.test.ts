import test from 'node:test'
import assert from 'node:assert/strict'
import { computeDeathIndex } from './scoring'
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
