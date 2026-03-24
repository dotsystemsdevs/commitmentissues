import { RepoData } from './types'

export function computeDeathIndex(repo: RepoData): number {
  const now = new Date()
  const lastCommit = new Date(repo.lastCommitDate)
  const daysSince = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24)

  let score = 0

  if (daysSince > 730) score += 4
  else if (daysSince > 365) score += 2
  else if (daysSince > 180) score += 1

  if (repo.isArchived) score += 3
  if (repo.openIssuesCount > 20 && daysSince > 180) score += 1
  if (repo.stargazersCount > 100 && daysSince > 365) score += 1

  return Math.min(score, 10)
}

export function getDeathLabel(index: number): string {
  if (index <= 2) return 'too soon to tell'
  if (index <= 5) return 'struggling'
  if (index <= 8) return 'dying'
  return 'dead dead'
}

export function determineCauseOfDeath(repo: RepoData): string {
  const now = new Date()
  const lastCommit = new Date(repo.lastCommitDate)
  const daysSince = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24)
  const msgLower = repo.lastCommitMessage.toLowerCase()
  const descLower = (repo.description ?? '').toLowerCase()
  const isJS =
    repo.topics.some(t => t.toLowerCase() === 'node') ||
    repo.language?.toLowerCase() === 'javascript'

  const rules = [
    {
      score: repo.isArchived ? 10 : 0,
      cause: 'Officially declared dead by author',
    },
    {
      score: msgLower.includes('fix typo') || msgLower.includes('update readme') ? 8 : 0,
      cause: 'Died whispering: one last fix',
    },
    {
      score: repo.isFork ? 7 : 0,
      cause: 'Forked but never understood',
    },
    {
      score: daysSince > 730 && repo.stargazersCount === 0 ? 7 : 0,
      cause: 'Died alone, unknown to the world',
    },
    {
      score: repo.stargazersCount > 200 && daysSince > 365 ? 7 : 0,
      cause: 'Started strong. Never finished.',
    },
    {
      score: repo.openIssuesCount > 50 ? 7 : 0,
      cause: 'Crushed under the weight of expectations',
    },
    {
      score: !repo.description ? 6 : 0,
      cause: 'No README. No hope.',
    },
    {
      score: descLower.includes('todo') ? 6 : 0,
      cause: 'Too ambitious for its own good',
    },
    {
      score: isJS && daysSince > 365 ? 5 : 0,
      cause: 'Lost in dependency hell',
    },
    {
      score: descLower.includes('microservice') || descLower.includes('enterprise') ? 5 : 0,
      cause: 'Killed by overengineering',
    },
    {
      score: repo.forksCount > repo.stargazersCount ? 4 : 0,
      cause: 'Abandoned for a shinier idea',
    },
    {
      score:
        descLower.includes('learn') ||
        descLower.includes('tutorial') ||
        descLower.includes('course')
          ? 3
          : 0,
      cause: 'Victim of tutorial fatigue',
    },
    {
      score: descLower.includes('mvp') || descLower.includes('prototype') ? 3 : 0,
      cause: 'Left to rot after MVP',
    },
    {
      score: 1,
      cause: 'Side project syndrome',
    },
  ]

  const maxScore = Math.max(...rules.map(r => r.score))
  const topMatches = rules.filter(r => r.score === maxScore)
  return topMatches[Math.floor(Math.random() * topMatches.length)].cause
}

export function generateLastWords(repo: RepoData): string {
  const now = new Date()
  const lastCommit = new Date(repo.lastCommitDate)
  const daysSince = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24)
  const msgLower = repo.lastCommitMessage.toLowerCase()

  if (msgLower.includes('fix typo')) return 'pls work now'
  if (msgLower.includes('update readme')) return 'at least the docs are good'
  if (msgLower.includes('wip') || msgLower.includes('work in progress')) return "i'll finish this later"
  if (msgLower.includes('merge')) return 'dying in a merge conflict'
  if (daysSince > 730 && repo.stargazersCount === 0) return "i'll finish this later"
  if (repo.stargazersCount > 200 && daysSince > 365) return 'i thought people liked me'

  const msg = repo.lastCommitMessage.split('\n')[0]
  return msg.length > 80 ? msg.slice(0, 77) + '...' : msg
}

export function computeAge(createdAt: string, lastCommitDate: string): string {
  const start = new Date(createdAt)
  const end = new Date(lastCommitDate)
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  if (months < 0) {
    years--
    months += 12
  }
  const parts: string[] = []
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`)
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`)
  return parts.length > 0 ? parts.join(', ') : 'less than a month'
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildShareText(repoName: string, cause: string): string {
  return `This repo just died.\n\n${repoName}\nCause: ${cause}\n\n🪦 commitmentissues.dev`
}
