import * as fs from 'fs'
import * as path from 'path'

console.log(`
┌──────────────────────────────────────────┐
│   Pedro Advent Calendar Agent Runner     │
└──────────────────────────────────────────┘
`)

const rootDir = process.cwd()
const agentMdPath = path.join(rootDir, '.agent', 'AGENT.md')

if (!fs.existsSync(agentMdPath)) {
  console.error(`[AGENT] Error: Persona file not found at ${agentMdPath}`)
  process.exit(1)
}

const agentMdContent = fs.readFileSync(agentMdPath, 'utf8')

// Simple YAML frontmatter parser
function parseFrontmatter(content: string): Record<string, unknown> {
  const trimmed = content.trim()
  const data: Record<string, unknown> = {}
  if (trimmed.startsWith('---')) {
    const parts = trimmed.split('---')
    if (parts.length >= 3) {
      const yaml = parts[1]
      const lines = yaml.split('\n')
      let currentKey = ''
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue
        
        if (trimmedLine.startsWith('-')) {
          const listVal = trimmedLine.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '')
          if (currentKey && Array.isArray(data[currentKey])) {
            (data[currentKey] as string[]).push(listVal)
          }
        } else {
          const colonIdx = trimmedLine.indexOf(':')
          if (colonIdx !== -1) {
            const key = trimmedLine.slice(0, colonIdx).trim()
            const val = trimmedLine.slice(colonIdx + 1).trim()
            if (val === '') {
              currentKey = key
              data[key] = []
            } else {
              currentKey = key
              data[key] = val.replace(/^["']|["']$/g, '')
            }
          }
        }
      }
    }
  }
  return data
}

const metadata = parseFrontmatter(agentMdContent)
const availableSkills = (metadata.skills as string[]) || []

const args = process.argv.slice(2)
const skillName = args[0] || 'md-to-json'

if (!availableSkills.includes(skillName)) {
  console.warn(`[AGENT] Warning: Skill "${skillName}" is not registered in AGENT.md.`)
  console.log(`[AGENT] Registered skills: ${availableSkills.join(', ')}`)
  process.exit(1)
}

console.log(`[AGENT] Dispatching to skill: ${skillName}...`)

const skillIndexModulePath = path.join(rootDir, '.agent', 'skills', skillName, 'index')

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { execute } = require(skillIndexModulePath)
  if (typeof execute === 'function') {
    execute()
  } else {
    console.error(`[AGENT] Error: Skill module does not export an 'execute' function.`)
    process.exit(1)
  }
} catch (e) {
  console.error(`[AGENT] Error executing skill "${skillName}":`, e)
  process.exit(1)
}
