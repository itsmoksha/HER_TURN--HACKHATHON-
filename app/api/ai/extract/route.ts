import { NextRequest, NextResponse } from 'next/server'
import { extractPrescription, ExtractedPrescription } from '@/lib/ai/gemini-service'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

/**
 * POST /api/ai/extract
 * Extracts structured medical data, prescriptions, and lab values from uploaded images/PDFs.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let fileBase64 = ''
    let mimeType = 'image/jpeg'
    let documentType = 'prescription'

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const docTypeField = formData.get('documentType') as string | null

      if (!file) {
        return NextResponse.json(
          { error: 'No file was provided in the request.' },
          { status: 400 }
        )
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds the 10MB limit (uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` },
          { status: 400 }
        )
      }

      mimeType = file.type || 'image/jpeg'
      if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Unsupported file format: ${mimeType}. Please upload a JPEG, PNG, or PDF file.`,
          },
          { status: 400 }
        )
      }

      if (docTypeField) {
        documentType = docTypeField
      }

      const buffer = await file.arrayBuffer()
      fileBase64 = Buffer.from(buffer).toString('base64')
    } else {
      // JSON body support
      const body = await req.json()
      if (!body.file && !body.imageBase64 && !body.fileBase64) {
        return NextResponse.json(
          { error: 'Missing file payload in request.' },
          { status: 400 }
        )
      }

      fileBase64 = body.file || body.imageBase64 || body.fileBase64
      mimeType = body.mimeType || 'image/jpeg'
      if (body.documentType) {
        documentType = body.documentType
      }

      // Check approximate base64 payload size (base64 is ~4/3 larger than binary)
      const approxSizeBytes = Math.round((fileBase64.length * 3) / 4)
      if (approxSizeBytes > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds maximum allowed 10MB.' },
          { status: 400 }
        )
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Unsupported file format: ${mimeType}. Please upload a JPEG, PNG, or PDF file.`,
          },
          { status: 400 }
        )
      }
    }

    // Call extraction service
    const extractedData: ExtractedPrescription = await extractPrescription(fileBase64, mimeType)

    return NextResponse.json(
      {
        success: true,
        documentType,
        data: extractedData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API /api/ai/extract] Extraction error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process and extract medical document.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 })
}
