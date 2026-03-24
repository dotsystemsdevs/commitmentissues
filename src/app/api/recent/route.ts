import { NextResponse } from 'next/server'
import { getRecent } from '@/lib/recentStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getRecent())
}
