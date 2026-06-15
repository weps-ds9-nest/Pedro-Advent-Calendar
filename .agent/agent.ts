import * as fs from 'fs'
import * as path from 'path'

const args = process.argv.slice(2)
const skillName = args[0] || 'md-to-json'

console.log(`
┌──────────────────────────────────────────┐
│   Pedro Advent Calendar AI Assistant     │
└──────────────────────────────────────────┘
`)

const skillsDir = path.join(__dirname, 'skills')

if (!fs.existsSync(skillsDir)) {
  console.error(`[AGENT] Error: Skills directory not found at ${skillsDir}`)
  process.exit(1)
}

const availableSkills = fs.readdirSync(skillsDir).filter((f) => {
  return fs.statSync(path.join(skillsDir, f)).isDirectory()
})

if (!availableSkills.includes(skillName)) {
  console.warn(`[AGENT] Warning: Skill "${skillName}" is not installed or available.`)
  console.log(`[AGENT] Available skills: ${availableSkills.join(', ')}`)
  process.exit(1)
}

console.log(`[AGENT] Triggering skill: ${skillName}...`)

if (skillName === 'md-to-json') {
  try {
    // Dynamically load the TS file (compiled or run via tsx)
    const { execute } = require('./skills/md-to-json/index')
    execute()
  } catch (e) {
    console.error(`[AGENT] Error executing md-to-json:`, e)
    process.exit(1)
  }
} else {
  console.log(`[AGENT] Skill "${skillName}" is a stub and cannot be run. Please install its implementation.`)
}
