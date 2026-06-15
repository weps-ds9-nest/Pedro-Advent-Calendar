# Lesson Data Model Schema

This document details the properties expected in the compiled `lessons.json` database.

## TypeScript Interface (`src/types/lesson.ts`)
```typescript
export interface Lesson {
  id: number         // Day number (1-24)
  day: number        // Day number (1-24)
  title: string      // Lesson heading
  description?: string // Short subtitle summary
  content?: string   // Compiled HTML string for the body
  tip?: string       // Pro-tip overlay text
  icon?: string      // Custom image file path (relative to /icons/)
}
```

## JSON Object Example
```json
{
  "id": 1,
  "day": 1,
  "title": "Introduction to Claude Code",
  "description": "Get started with Claude Code and learn basic operations.",
  "tip": "Run `claude` in your terminal to begin.",
  "content": "<p>Welcome to the <strong>Claude Code Advent Calendar</strong>! 🎄</p>",
  "icon": "pedro-custom.webp"
}
```

## Markdown Representation
When writing in the englobing `lessons.md` file, lessons are delimited by main level headings:
- **Heading**: `# Day [Day Number]: [Title]`
- **Description**: `**Description:** [Text]` (must be on its own line)
- **Pro-Tip**: `**Tip:** [Text]` (must be on its own line)
- **Content**: The remainder of the text in the section.
