import { NextRequest, NextResponse } from 'next/server'
import { getMockData } from '@/lib/db/mock-data'

export async function GET() {
  const data = getMockData()
  return NextResponse.json({ documents: data.documents })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    return NextResponse.json({
      success: true,
      document: {
        id: `doc_${Date.now()}`,
        ...body,
        created_at: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 })
  }
  return NextResponse.json({ success: true, deleted: id })
}
