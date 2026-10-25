import { NextRequest, NextResponse } from 'next/server'
import { getMockData } from '@/lib/db/mock-data'
import { randomUUID } from 'crypto'

export async function GET() {
  const data = getMockData()
  return NextResponse.json({ trustedPeople: data.trustedPeople })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inviteToken = randomUUID()
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/trusted/accept?token=${inviteToken}`
    return NextResponse.json({
      success: true,
      trustedPerson: {
        id: `tp_${Date.now()}`,
        ...body,
        invite_token: inviteToken,
        invite_link: inviteLink,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    return NextResponse.json({ success: true, updated: body })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  return NextResponse.json({ success: true, revoked: id })
}
