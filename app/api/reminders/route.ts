import { NextRequest, NextResponse } from 'next/server'
import { getMockData } from '@/lib/db/mock-data'

export async function GET() {
  const data = getMockData()
  return NextResponse.json({ reminders: data.reminders })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    return NextResponse.json({
      success: true,
      reminder: { id: `rem_${Date.now()}`, ...body, created_at: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
