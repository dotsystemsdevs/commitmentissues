import { NextResponse } from 'next/server'
import { getRecent } from '@/lib/recentStore'

export async function GET() {
  return NextResponse.json(await getRecent())
}
