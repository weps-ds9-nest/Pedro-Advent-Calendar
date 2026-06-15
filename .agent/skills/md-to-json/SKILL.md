# Skill: MD to JSON Compiler

Converts lesson content from markdown into the structured `lessons.json` database used by the Next.js frontend application.

## Capabilities
- **Single File Parsing**: Parses an englobing `lessons.md` file located at the root of the project. It splits the document on `## Day X` headings.
- **Directory Parsing**: Scans the `content/lessons/` folder for files named `day-X.md` or `X.md`.
- **Attribute Extraction**: Extracts `day`, `title`, `description`, and `tip` metadata from the frontmatter or top section formatting.
- **Markdown-to-HTML Compilation**: Converts markdown paragraphs, bold/italic markup, lists, and code blocks into safe HTML content suitable for insertion in the page via `dangerouslySetInnerHTML`.

## Expected Markdown Format

### Option A: Single Englobing File (`lessons.md` in root)
```markdown
# Day 1: Introduction to Claude Code
**Description:** Get started with the Claude Code CLI tool.
**Tip:** Run `claude` in your terminal.

Welcome to day 1! Here is the lesson text...

## Day 2: Advanced Usage
**Description:** Dive deeper into agent workflows.
**Tip:** Use keyboard shortcuts for faster navigation.

Lesson 2 content goes here...
```

### Option B: Individual Files (`content/lessons/day-01.md`)
```markdown
---
day: 1
title: Introduction to Claude Code
description: Get started with the Claude Code CLI tool.
tip: Run `claude` in your terminal.
---

Welcome to day 1! Here is the lesson text...
```
