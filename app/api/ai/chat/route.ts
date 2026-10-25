import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { assessSafety } from '@/lib/ai/safety-detector'
import { generateChatResponse, ChatResponse } from '@/lib/ai/gemini-service'

// Zod validation schema for chat requests
const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required'),
  sessionId: z.string().optional(),
  documentContext: z.string().optional(),
  userId: z.string().trim().min(1, 'User ID is required'),
  userName: z.string().optional().default('Friend'),
  language: z.enum(['en', 'hi', 'kn']).default('en'),
  chatHistory: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
})

/**
 * POST /api/ai/chat
 * Handles incoming user health messages with mandatory safety escalation checks.
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parseResult = chatRequestSchema.safeParse(json)

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { message, documentContext, userId, userName, language, chatHistory } = parseResult.data

    // 1. Mandatory Safety & Red-Flag Assessment FIRST
    const assessment = assessSafety(message)

    // 2. If URGENT red flag detected: Short-circuit immediately, do NOT invoke Gemini
    if (assessment.triageLevel === 'urgent') {
      const urgentResponse: ChatResponse = {
        content: `${assessment.urgentCareMessage || 'This sounds like it may need immediate medical attention. Please call emergency services (102/112 in India) or go to your nearest emergency room NOW. Do not wait.'}\n\nPlease do not delay seeking professional emergency care. If someone is with you, notify them immediately.`,
        citations: [],
        triageLevel: 'urgent',
        safetyFlagged: true,
        disclaimer:
          'EMERGENCY ADVISORY: The symptoms you described require prompt medical evaluation by emergency healthcare personnel. HER TURN is not an emergency response service.',
        suggestedFollowUps: [
          'Call 102 (Ambulance) or 112 (National Emergency)',
          'Locate the nearest emergency room',
        ],
      }

      return NextResponse.json(
        {
          response: urgentResponse,
          assessment,
        },
        { status: 200 }
      )
    }

    // 3. If CAUTION: Call Gemini but enforce caution triage status & guidance
    if (assessment.triageLevel === 'caution') {
      const aiResponse = await generateChatResponse(
        message,
        documentContext,
        chatHistory,
        userName,
        language
      )

      // Ensure the response explicitly carries caution triage and warning
      const cautionResponse: ChatResponse = {
        ...aiResponse,
        triageLevel: 'caution',
        safetyFlagged: true,
        disclaimer: `IMPORTANT: ${assessment.recommendedAction || 'This is worth discussing with your doctor soon. Please book an appointment within the next few days.'} ${aiResponse.disclaimer}`,
      }

      return NextResponse.json(
        {
          response: cautionResponse,
          assessment,
        },
        { status: 200 }
      )
    }

    // 4. If SAFE: Call Gemini normally
    const normalResponse = await generateChatResponse(
      message,
      documentContext,
      chatHistory,
      userName,
      language
    )

    return NextResponse.json(
      {
        response: normalResponse,
        assessment,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API /api/ai/chat] Handler error:', error)
    return NextResponse.json(
      {
        error: 'An internal error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 })
}
