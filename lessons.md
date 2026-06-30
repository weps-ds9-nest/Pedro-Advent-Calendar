# Day 1: Meeting the Terminal & Claude Code
**Description:** Install Claude Code, learn where it lives, and have your very first conversation with it.
**Tip:** Run `claude` in your terminal to start a session, and `Ctrl+C` or `exit` to stop it.

**Phase 1 — Foundations**

Welcome to Week 1! Claude Code is an AI assistant that lives right inside your terminal (or your code editor). Unlike a browser-based chatbot, it can see the files on your computer, run commands, and take action — all from a simple chat interface. This week we get it installed and say hello.

**What is Claude Code?**

Claude Code is a command-line tool made by Anthropic. You open a terminal, type `claude`, and you're in a conversation with an AI that can read your files, create new ones, run scripts, and help you think through problems — all without leaving your keyboard.

You don't have to use a terminal if you prefer a code editor. Claude Code installs as a plugin for the most popular IDEs:

- **VS Code** → [install from the Marketplace](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)
- **JetBrains** (IntelliJ, PyCharm, WebStorm…) → [install from the Plugin Hub](https://plugins.jetbrains.com/plugin/24169-claude-code)
- **Terminal** → follow the [official getting-started guide](https://docs.anthropic.com/en/docs/claude-code/getting-started)

Whichever you choose, the experience is the same: a chat panel where you talk to Claude and it acts on your project.

**A little terminal vocabulary (you'll need this):**

- **Terminal / shell** — the text window where you type commands
- **Current directory** — the folder the terminal is "inside" right now
- `pwd` — shows your current directory ("where am I?")
- `ls` — lists files in the current folder
- `cd <folder>` — moves into a folder
- `mkdir <name>` — creates a new folder

You only need these to navigate to the right folder before opening Claude Code. Once Claude is running, you can just ask it in plain English — "what files are here?" works just as well as `ls`.

**This week's exercise:**

Create a folder called `research-playground` on your Desktop, navigate into it, and open Claude Code there. Then ask it: *"What folder am I in and what files does it contain?"* — notice how it answers using real information from your computer, not a generic response.

**Make it yours:** Ask Claude Code to create a file called `hello.md` inside the folder and write a one-sentence introduction to itself. Open the file and read what it wrote.

### Tasks
- Install Claude Code using whichever method fits your setup (terminal, VS Code, or JetBrains — links above)
- Open your terminal, run `pwd` to see where you are, then use `cd` and `mkdir` to create and enter a folder called `research-playground` on your Desktop
- Start a Claude Code session (`claude` in the terminal, or open the panel in your IDE)
- Ask Claude: *"What folder am I in and what's in it?"* — confirm it gives you a real answer about your machine
- Ask Claude to create `hello.md` with a one-sentence description of itself, then open the file

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
