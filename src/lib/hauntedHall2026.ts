/**
 * The 2026 Haunted Hall — real, verified 2026 archivals.
 *
 * Every entry below was checked against the live GitHub API
 * (`gh api repos/<owner>/<repo>`) on 2026-10-15: `archived` is true and the
 * last push (`pushedAt`) falls inside 2026, which we use as the death date.
 * `cause` is not invented — it is the literal output of
 * `determineCauseOfDeath()` from scoring.ts for an archived repo (the
 * archived-flag rule always scores 10, the highest in the rule table, so
 * every archived repo resolves to the same cause). Do not add an entry here
 * without verifying archived + pushedAt first.
 */
export interface HauntedHallEntry {
  fullName: string
  description: string | null
  pushedAt: string
  cause: string
  stars: number
}

export const HAUNTED_HALL_2026: HauntedHallEntry[] = [
  { fullName: 'daytonaio/daytona', description: 'Daytona is a Secure and Elastic Infrastructure for Running AI-Generated Code', pushedAt: '2026-07-24T07:12:07Z', cause: 'Officially declared dead by author', stars: 71543 },
  { fullName: 'localstack/localstack', description: 'A fully functional local AWS cloud stack. Develop and test your cloud & Serverless apps offline', pushedAt: '2026-03-23T08:52:01Z', cause: 'Officially declared dead by author', stars: 65138 },
  { fullName: 'minio/minio', description: 'MinIO is a high-performance, S3 compatible object store, open sourced under GNU AGPLv3 license.', pushedAt: '2026-04-24T17:54:39Z', cause: 'Officially declared dead by author', stars: 61320 },
  { fullName: 'FlowiseAI/Flowise', description: 'Build AI Agents, Visually', pushedAt: '2026-08-13T12:38:19Z', cause: 'Officially declared dead by author', stars: 55505 },
  { fullName: 'openai/gym', description: 'A toolkit for developing and comparing reinforcement learning algorithms.', pushedAt: '2026-03-26T23:13:27Z', cause: 'Officially declared dead by author', stars: 37241 },
  { fullName: 'slatedocs/slate', description: 'Beautiful static documentation for your API', pushedAt: '2026-02-01T05:54:12Z', cause: 'Officially declared dead by author', stars: 36014 },
  { fullName: 'filebrowser/filebrowser', description: 'File Browser provides a file managing interface within a specified directory and it can be used to upload, delete, preview and edit your files.', pushedAt: '2026-07-31T10:06:58Z', cause: 'Officially declared dead by author', stars: 35893 },
  { fullName: 'blueimp/jQuery-File-Upload', description: 'File Upload widget with multiple file selection, drag&drop support, progress bar, validation and preview images for jQuery.', pushedAt: '2026-04-08T09:52:14Z', cause: 'Officially declared dead by author', stars: 30690 },
  { fullName: 'voideditor/void', description: null, pushedAt: '2026-06-02T22:03:55Z', cause: 'Officially declared dead by author', stars: 28754 },
  { fullName: 'codemirror/codemirror5', description: 'In-browser code editor (version 5, legacy)', pushedAt: '2026-04-16T15:39:18Z', cause: 'Officially declared dead by author', stars: 27207 },
  { fullName: 'microsoft/typescript-go', description: 'Staging repo for development of native port of TypeScript', pushedAt: '2026-08-31T14:21:13Z', cause: 'Officially declared dead by author', stars: 26128 },
  { fullName: 'alibaba/fastjson', description: 'FASTJSON 2.0.x has been released, faster and more secure, recommend you upgrade.', pushedAt: '2026-07-29T08:04:40Z', cause: 'Officially declared dead by author', stars: 25579 },
  { fullName: 'nylas/nylas-mail', description: 'An extensible desktop mail app built on the modern web. Forks welcome!', pushedAt: '2026-06-25T18:19:29Z', cause: 'Officially declared dead by author', stars: 24735 },
  { fullName: 'RooCodeInc/Roo-Code', description: 'Roo Code gives you a whole dev team of AI agents in your code editor.', pushedAt: '2026-05-15T18:08:47Z', cause: 'Officially declared dead by author', stars: 24276 },
]

export function formatDeathMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
