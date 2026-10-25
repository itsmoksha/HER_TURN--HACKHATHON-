import { NextRequest, NextResponse } from 'next/server'
import {
  getOllamaStatus,
  validateAndParseReportWithOllama,
  chatWithOllama,
} from '@/lib/ai/ollama-service'

export async function GET() {
  const status = await getOllamaStatus()
  return NextResponse.json(status)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'status') {
      const status = await getOllamaStatus()
      return NextResponse.json(status)
    }

    if (action === 'validate_report') {
      const { text, fileName } = body
      if (!text || typeof text !== 'string') {
        return NextResponse.json(
          { error: 'Document text is required for validation.' },
          { status: 400 }
        )
      }

      const result = await validateAndParseReportWithOllama(text, fileName)
      return NextResponse.json(result)
    }

    if (action === 'chat') {
      const { message, chatHistory, documentContext, role, patientName, caretakerName } = body
      if (!message) {
        return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
      }

      const reply = await chatWithOllama({
        message,
        chatHistory: Array.isArray(chatHistory) ? chatHistory : [],
        documentContext,
        role,
        patientName,
        caretakerName,
      })

      return NextResponse.json(reply)
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (error: any) {
    console.error('Error in /api/ai/ollama:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing Ollama request' },
      { status: 500 }
    )
  }
}
