import { NextResponse } from 'next/server'
import { getMockData } from '@/lib/db/mock-data'

export async function GET() {
  // In a real implementation, this would fetch from Supabase with the authenticated user's ID.
  // For demo mode, we return a sanitized export of mock data.
  const data = getMockData()

  const exportData = {
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0',
    app: 'HER TURN',
    notice: 'This export contains your personal health data. Keep it safe.',
    profile: {
      name: data.user.name,
      email: data.user.email,
      ageRange: data.user.age_range,
      language: data.user.language,
      healthConditions: data.user.health_conditions,
      createdAt: data.user.created_at,
    },
    documents: data.documents.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      doctorName: d.doctor_name,
      documentDate: d.document_date,
      tags: d.tags,
      aiSummary: d.ai_summary,
      // file_url omitted for security
    })),
    medicines: data.medicines,
    reminders: data.reminders.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      scheduledTime: r.scheduled_time,
      isActive: r.is_active,
    })),
    appointments: data.appointments,
    trustedPeople: data.trustedPeople.map((tp) => ({
      id: tp.id,
      name: tp.trusted_name,
      relation: tp.relation,
      status: tp.status,
      // email omitted
    })),
    chatSessions: data.chatHistory.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.created_at,
    })),
  }

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="her-turn-data-export.json"',
    },
  })
}
