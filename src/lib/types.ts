export interface RepoData {
  name: string
  fullName: string
  description: string | null
  createdAt: string
  pushedAt: string
  isArchived: boolean
  stargazersCount: number
  forksCount: number
  openIssuesCount: number
  language: string | null
  topics: string[]
  isFork: boolean
  commitCount: number
  lastCommitMessage: string
  lastCommitDate: string
}

export interface DeathCertificate {
  repoData: RepoData
  deathIndex: number
  deathLabel: string
  causeOfDeath: string
  deathDate: string
  age: string
  lastWords: string
  mourners: string
  shareText: string
}

export interface ApiErrorResponse {
  error: string
  retryAfter?: number
}

export type ApiResponse = DeathCertificate | ApiErrorResponse

export interface UserRepoSummary {
  fullName: string
  pushedAt: string | null
  isArchived: boolean
  language: string | null
  daysSinceLastPush: number | null
  isDead: boolean
  isStruggling: boolean
  cause: string
}

export interface LeaderboardEntry {
  fullName: string
  cause: string
  score: number
  analyzedAt?: string  // ISO timestamp — set by backend for recently buried
  deathDate?: string   // human-readable death date for curated entries
  lastWords?: string
}
