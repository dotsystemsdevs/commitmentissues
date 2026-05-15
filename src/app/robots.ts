import { MetadataRoute } from 'next'

// AI/LLM crawlers — explicit allow improves GEO discoverability.
const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'CCBot',
  'anthropic-ai',
  'cohere-ai',
  'Bytespider',
  'Amazonbot',
  'DuckAssistBot',
  'YouBot',
  'Applebot-Extended',
  'Meta-ExternalAgent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: '/' })),
    ],
    sitemap: 'https://commitmentissues.dev/sitemap.xml',
  }
}
