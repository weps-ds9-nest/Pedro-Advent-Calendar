import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import lessonsData from '@/data/lessons.json'
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

  const lessons = lessonsData as Lesson[]
  const lesson = lessons.find((l) => l.id === id)

  // Return null lesson (slot exists, content not published yet)
  if (!lesson) {
    return NextResponse.json({ id, day: id, title: '', published: false })
  }

  return NextResponse.json({ ...lesson, published: true })
}
