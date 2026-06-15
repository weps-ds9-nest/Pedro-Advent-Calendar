import * as fs from 'fs'
import * as path from 'path'

interface LessonData {
  id: number
  day: number
  title: string
  description?: string
  content?: string
  tip?: string
}

// Simple regex-based markdown-to-HTML parser (zero external dependencies)
function parseMarkdownToHtml(markdown: string): string {
  let html = markdown.trim()

  if (!html) return ''

  // Escape HTML entities to prevent rendering issues, except we'll inject tags
  // Code blocks: ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (_, p1) => {
    const escapedCode = p1
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
    return `<pre><code>${escapedCode}</code></pre>`
  })

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, (_, p1) => {
    return `<code>${p1}</code>`
  })

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // Italics: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

  // Headers: ###, ##, #
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Blockquotes: > text
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Unordered lists: - text or * text
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li-u>$1</li-u>')

  // Ordered lists: 1. text
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li-o>$1</li-o>')

  // Wrap consecutive list tags in ul/ol and clean up
  html = html.replace(/(<li-u>.*<\/li-u>)/gim, '<ul>$1</ul>')
  html = html.replace(/<\/ul>\s*<ul>/g, '')
  html = html.replace(/<li-u>/g, '<li>').replace(/<\/li-u>/g, '</li>')

  html = html.replace(/(<li-o>.*<\/li-o>)/gim, '<ol>$1</ol>')
  html = html.replace(/<\/ol>\s*<ol>/g, '')
  html = html.replace(/<li-o>/g, '<li>').replace(/<\/li-o>/g, '</li>')

  // Paragraphs: Wrap double newlines in <p> if they are not inside block tags
  const blocks = html.split(/\n\s*\n/)
  html = blocks
    .map((block) => {
      const trimmedBlock = block.trim()
      if (!trimmedBlock) return ''
      if (
        trimmedBlock.startsWith('<h') ||
        trimmedBlock.startsWith('<pre') ||
        trimmedBlock.startsWith('<ul') ||
        trimmedBlock.startsWith('<ol') ||
        trimmedBlock.startsWith('<blockquote') ||
        trimmedBlock.startsWith('<li')
      ) {
        return trimmedBlock
      }
      return `<p>${trimmedBlock.replace(/\n/g, '<br />')}</p>`
    })
    .filter(Boolean)
    .join('\n')

  return html
}

function parseFrontmatter(content: string): { data: Record<string, string>; body: string } {
  const trimmed = content.trim()
  if (trimmed.startsWith('---')) {
    const parts = trimmed.split('---')
    if (parts.length >= 3) {
      const yamlContent = parts[1]
      const body = parts.slice(2).join('---').trim()
      const data: Record<string, string> = {}
      const lines = yamlContent.split('\n')
      for (const line of lines) {
        const colonIdx = line.indexOf(':')
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim()
          const val = line
            .slice(colonIdx + 1)
            .trim()
            .replace(/^["']|["']$/g, '')
          data[key] = val
        }
      }
      return { data, body }
    }
  }
  return { data: {}, body: content }
}

function parseSingleFile(content: string): LessonData[] {
  const lines = content.split('\n')
  const lessons: LessonData[] = []
  let currentLesson: LessonData | null = null
  let currentBodyLines: string[] = []

  const headerRegex = /^(?:#+)\s*Day\s+(\d+)\s*[:\-\s]*(.*)$/i

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(headerRegex)

    if (match) {
      // Save previous lesson
      if (currentLesson) {
        currentLesson.content = parseMarkdownToHtml(currentBodyLines.join('\n'))
        lessons.push(currentLesson)
      }

      const dayNum = parseInt(match[1], 10)
      const title = match[2].trim()

      currentLesson = {
        id: dayNum,
        day: dayNum,
        title: title || `Day ${dayNum}`,
      }
      currentBodyLines = []
    } else if (currentLesson) {
      // Parse description/tip from top lines of the body
      const descMatch = line.match(/^\s*(?:\*\*|\*)?Description:(?:\*\*|\*)?\s*(.*)$/i)
      const tipMatch = line.match(/^\s*(?:\*\*|\*)?Tip:(?:\*\*|\*)?\s*(.*)$/i)

      if (descMatch) {
        currentLesson.description = descMatch[1].trim()
      } else if (tipMatch) {
        currentLesson.tip = tipMatch[1].trim()
      } else {
        // Look for YAML frontmatter boundaries in the body if any
        currentBodyLines.push(line)
      }
    }
  }

  if (currentLesson) {
    currentLesson.content = parseMarkdownToHtml(currentBodyLines.join('\n'))
    lessons.push(currentLesson)
  }

  // Parse frontmatter inside body lines if present
  return lessons.map((lesson) => {
    if (lesson.content) {
      const rawBody = lesson.content // note: content here is still raw before conversion, wait
    }
    // Wait, let's fix: if body has frontmatter, parse it before converting to HTML
    return lesson
  })
}

// Refined single file parser that checks for frontmatter or headers
function parseLessonsMarkdown(content: string): LessonData[] {
  // Split the file on day headings
  const headerRegex = /(?:\n|^)(?:#+)\s*Day\s+(\d+)\s*[:\-\s]*(.*)/gi
  const parts = content.split(headerRegex)
  
  // parts[0] is content before "Day 1"
  // parts[1] is Day 1 number
  // parts[2] is Day 1 title
  // parts[3] is Day 1 body
  // etc.
  const lessons: LessonData[] = []
  
  for (let i = 1; i < parts.length; i += 3) {
    const dayNum = parseInt(parts[i], 10)
    const title = parts[i + 1].trim()
    const sectionBody = parts[i + 2] || ''
    
    // Parse frontmatter if it exists in the section body
    const { data, body } = parseFrontmatter(sectionBody)
    
    // Parse description and tip if not in frontmatter
    let description = data.description || data.desc
    let tip = data.tip || data.proTip
    let finalTitle = data.title || title || `Day ${dayNum}`
    
    const bodyLines = body.split('\n')
    const contentLines: string[] = []
    
    for (const line of bodyLines) {
      const descMatch = line.match(/^\s*(?:\*\*|\*)?Description:(?:\*\*|\*)?\s*(.*)$/i)
      const tipMatch = line.match(/^\s*(?:\*\*|\*)?Tip:(?:\*\*|\*)?\s*(.*)$/i)
      
      if (descMatch && !description) {
        description = descMatch[1].trim()
      } else if (tipMatch && !tip) {
        tip = tipMatch[1].trim()
      } else {
        contentLines.push(line)
      }
    }
    
    lessons.push({
      id: dayNum,
      day: dayNum,
      title: finalTitle,
      description: description ? description.replace(/^["']|["']$/g, '') : undefined,
      tip: tip ? tip.replace(/^["']|["']$/g, '') : undefined,
      content: parseMarkdownToHtml(contentLines.join('\n')),
    })
  }
  
  return lessons
}

export function execute() {
  const rootDir = process.cwd()
  const singleFilePath = path.join(rootDir, 'lessons.md')
  const contentLessonsDir = path.join(rootDir, 'content', 'lessons')
  
  let lessons: LessonData[] = []
  
  if (fs.existsSync(singleFilePath)) {
    console.log(`[MD-TO-JSON] Found single englobing file: ${singleFilePath}`)
    const content = fs.readFileSync(singleFilePath, 'utf8')
    lessons = parseLessonsMarkdown(content)
  } else if (fs.existsSync(contentLessonsDir)) {
    console.log(`[MD-TO-JSON] Scanning directory: ${contentLessonsDir}`)
    const files = fs.readdirSync(contentLessonsDir)
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentLessonsDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data, body } = parseFrontmatter(fileContent)
        
        const dayMatch = file.match(/day-(\d+)\.md|(\d+)\.md/i)
        const day = data.day ? parseInt(data.day, 10) : (dayMatch ? parseInt(dayMatch[1] || dayMatch[2], 10) : 0)
        
        if (day > 0) {
          lessons.push({
            id: day,
            day: day,
            title: data.title || `Day ${day}`,
            description: data.description || data.desc,
            tip: data.tip || data.proTip,
            content: parseMarkdownToHtml(body),
          })
        }
      }
    }
  } else {
    console.error(`[MD-TO-JSON] Error: Neither 'lessons.md' nor 'content/lessons/' was found.`)
    process.exit(1)
  }
  
  // Sort lessons by day
  lessons.sort((a, b) => a.day - b.day)
  
  // Write to src/data/lessons.json
  const outPath = path.join(rootDir, 'src', 'data', 'lessons.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(lessons, null, 2), 'utf8')
  
  console.log(`[MD-TO-JSON] Successfully compiled ${lessons.length} lessons to ${outPath}`)
}
