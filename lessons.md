# Day 1: Meeting the Terminal & Claude Code
**Description:** Get comfortable opening a terminal, moving around folders, and starting/stopping a Claude Code session.
**Tip:** Run `claude` in your terminal to start a session, and `Ctrl+C` or `exit` to stop it.

**Phase 1 — Foundations**

Welcome to Week 1! Before we touch Claude Code, we need to feel at home in the terminal. Think of it as learning to walk in a new city before running.

**New concepts & commands:**

- What a terminal is and what "the current directory" means
- `pwd` — print working directory ("where am I?")
- `ls` — list files in the current folder
- `cd` — change directory (move into a folder)
- `mkdir` — create a new folder
- Installing Claude Code and logging in
- Starting Claude Code with `claude`, exiting with `Ctrl+C` / `exit`

**This week's exercise:**

Create a folder called `research-playground` on your Desktop, `cd` into it, and open Claude Code there. Ask it: "What folder am I in and what's in it?" — notice how it answers.

**Make it yours:** Practice navigating to 2–3 different folders on your computer (Desktop, Documents, a project folder) using only `cd` and `ls` — no mouse allowed.

### Tasks
- Open your terminal and run `pwd` — confirm you can see your current folder path
- Use `cd` and `ls` to navigate to your Desktop and list its contents
- Create a folder called `research-playground` using `mkdir` and `cd` into it
- Install Claude Code and run `claude` to start your first session — then exit with `Ctrl+C`

# Day 2: Talking to Claude Code
**Description:** Learn the basic conversational loop — asking, reading responses, and referencing files.
**Tip:** Reference any file in your project with @filename so Claude can read it directly.

**Phase 1 — Foundations**

Claude Code isn't just a chatbot — it can read, create, and modify your files. This week we learn how to have a real conversation with it about your actual documents.

**New concepts & commands:**

- Prompting basics: be specific, give context, ask for one thing at a time
- Referencing a file with `@filename` to let Claude read it
- Asking Claude to read, explain, or summarize a file
- Asking Claude to create a simple text or markdown file

**This week's exercise:**

Drop a short text file (e.g. a paragraph of notes) into `research-playground`. Ask Claude to read it (`@notes.txt`) and summarize it in 3 bullet points. Then ask it to save that summary as a new file.

**Make it yours:** Take any short document you have — an email, a meeting note — and have Claude summarize it the same way. Compare it to your own mental summary.

### Tasks
- Create a short `notes.txt` file inside `research-playground` with a paragraph of your own writing
- Ask Claude to read it using `@notes.txt` and summarize it in 3 bullet points
- Ask Claude to save the summary as a new file called `notes-summary.md`
- Rewrite your prompt to be more specific and compare the two outputs — notice the difference
