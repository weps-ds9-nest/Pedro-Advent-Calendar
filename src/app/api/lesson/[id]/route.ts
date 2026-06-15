import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import lessonsData from '@/data/lessons.json'
import { getProgress } from '@/lib/kv'
import type { Lesson } from '@/types/lesson'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)

  if (isNaN(id) || id < 1 || id > 24) {
    return NextResponse.json({ error: 'Invalid lesson id' }, { status: 400 })
  }

  // Role is forwarded by middleware via x-user-role header
  const role = request.headers.get('x-user-role') ?? 'user'

  // Sequential gating for non-admins
  if (role !== 'admin') {
    const completedIds = await getProgress(role)
    if (id > 1 && !completedIds.includes(id - 1)) {
      return NextResponse.json({ error: 'Lesson locked' }, { status: 403 })
    }
  }

  const lessons = lessonsData as Lesson[]
  const lesson = lessons.find((l) => l.id === id)

  // Return null lesson (slot exists, content not published yet)
  if (!lesson) {
    return NextResponse.json({ id, day: id, title: '', published: false })
  }

  return NextResponse.json({ ...lesson, published: true })
}
