# Claude Code for Product Design Research — 24-Week Curriculum

**Audience:** Product Design Researcher, complete beginner to the terminal
**Cadence:** 1 lesson per week
**Arc:** Weeks 1–4 build general fluency with Claude Code and the terminal. From Week 4 onward, every lesson is anchored in a real research task, building toward a personal "research system" she can run independently by Week 24.

**How to run each session (for you, the facilitator):**
- Pair lessons with something from her *actual* work whenever possible — a real transcript, a real survey export, a real deliverable.
- Each week includes: a goal, new concepts/commands, a guided exercise, and a "make it yours" task she does on her own time before the next session.
- Don't rush Phase 1. A shaky mental model of "what is a folder, what is a file path" will cause confusion for months. Everything later compounds on it.

---

## Phase 1 — Foundations (Weeks 1–4)

### Week 1 — Meeting the Terminal & Claude Code
**Goal:** Get comfortable opening a terminal, moving around folders, and starting/stopping a Claude Code session.

**New concepts/commands:**
- What a terminal is, what "the current directory" means
- `pwd`, `ls`, `cd`, `mkdir`
- Installing Claude Code and logging in
- Starting Claude Code (`claude`), exiting (`Ctrl+C` / `exit`)

**Exercise:** Create a folder called `research-playground` on the desktop, `cd` into it, and open Claude Code there. Ask it "what folder am I in and what's in it?" and see how it answers.

**Make it yours:** Practice navigating to 2–3 different folders on her computer (Desktop, Documents, a project folder) using only `cd` and `ls`.

---

### Week 2 — Talking to Claude Code
**Goal:** Learn the basic conversational loop — asking, reading responses, referencing files.

**New concepts/commands:**
- Prompting basics: be specific, give context, ask for one thing at a time
- Referencing a file with `@filename`
- Asking Claude to read, explain, or summarize a file
- Asking Claude to create a simple text/markdown file

**Exercise:** Drop a short text file (e.g., a paragraph of notes) into `research-playground`. Ask Claude to read it (`@notes.txt`) and summarize it in 3 bullet points. Then ask it to save that summary as a new file.

**Make it yours:** Take any short document she has (an email, a meeting note) and have Claude summarize it the same way.

---

### Week 3 — Projects, Context & Safety
**Goal:** Understand how Claude Code "remembers" a project, and how to stay in control of what it does.

**New concepts/commands:**
- `CLAUDE.md` as a project's "instructions file" (intro only — we'll use it for real in Week 9)
- The approval/permission flow when Claude wants to edit or create files
- Plan Mode: asking Claude to *propose* a plan before doing anything
- Undoing/reverting a change

**Exercise:** Ask Claude (in plan mode) to propose a folder structure for organizing "research notes." Review the plan together, then approve it and watch it create the folders.

**Make it yours:** Practice saying no — ask Claude to do something, then reject its proposed plan and ask for a different approach.

---

### Week 4 — First Real Research Task
**Goal:** Apply everything so far to one real, low-stakes research artifact.

**New concepts/commands:**
- Organizing a small "project folder" (e.g., `interview-001/`)
- Asking Claude to extract specific things from a document (quotes, pain points, feature requests)
- Generating a markdown summary report

**Exercise:** Use one real (or anonymized/sample) interview transcript. Ask Claude to: (1) summarize the interview, (2) pull out 5 direct quotes about pain points, (3) save the result as `interview-001-summary.md`.

**Make it yours:** Repeat with a second transcript on her own — no help.

---

## Phase 2 — Research Workflow Foundations (Weeks 5–10)

### Week 5 — Working Across Multiple Transcripts
**Goal:** Move from "one document" to "a set of documents" — the core of synthesis work.

**New concepts/commands:**
- Putting multiple transcripts in one folder
- Asking Claude to read all files in a folder
- Asking for *cross-cutting* themes vs. per-document summaries

**Exercise:** With 3 transcripts in a folder, ask Claude: "What themes appear across all three interviews? For each theme, list which participant(s) mentioned it and a representative quote."

**Make it yours:** Try rephrasing the same request 2–3 different ways and compare the outputs — this builds intuition for prompting.

---

### Week 6 — Coding & Tagging Qualitative Data
**Goal:** Build a lightweight "codebook" — the foundation of structured qualitative analysis.

**New concepts/commands:**
- Asking Claude to tag quotes with codes (e.g., "navigation confusion," "pricing concern")
- Generating a simple CSV or markdown table of quote → code → source
- Iterating on a codebook (adding/merging/renaming codes)

**Exercise:** Ask Claude to go through the transcripts and produce a table: quote, suggested code, participant. Review it together and refine 2–3 codes that feel off.

**Make it yours:** Add a 4th transcript and ask Claude to apply the *same* codebook to it for consistency.

---

### Week 7 — Affinity Mapping & Synthesis
**Goal:** Go from tagged quotes to grouped insights — a digital affinity map.

**New concepts/commands:**
- Asking Claude to cluster codes/quotes into higher-level themes
- Structuring output as a hierarchy (theme → sub-theme → supporting quotes)
- Saving synthesis as a structured markdown document

**Exercise:** Using last week's tagged data, ask Claude to group the codes into 3–5 higher-level themes and produce a one-page synthesis document with supporting evidence for each.

**Make it yours:** Present this synthesis doc to a teammate and note where it needs human judgment vs. where Claude got it right.

---

### Week 8 — Custom Slash Commands
**Goal:** Turn repeated prompts into reusable one-word commands.

**New concepts/commands:**
- What a custom slash command is and where it lives
- Creating a personal command, e.g. `/summarize-interview`
- Adding simple arguments to a command

**Exercise:** Together, write a `/summarize-interview` command that takes a transcript file and produces the Week 4-style summary automatically. Test it on a new transcript.

**Make it yours:** Create a second command, `/tag-quotes`, based on the Week 6 workflow.

---

### Week 9 — CLAUDE.md as a Research Assistant Config
**Goal:** Give Claude "standing instructions" so every research task follows her preferences by default.

**New concepts/commands:**
- Writing a `CLAUDE.md` for a research project: tone, output format, codebook conventions, file naming
- How Claude reads this file automatically at the start of a session

**Exercise:** Write a `CLAUDE.md` together that says, e.g.: "Always output summaries in markdown with this structure... Always use this codebook... Always cite participant IDs, never names." Re-run a Week 5 task and compare consistency.

**Make it yours:** Add 2–3 of her own personal preferences to the file (e.g., a specific report template she likes).

---

### Week 10 — Mini-Project 1: End-to-End Synthesis
**Goal:** Independently run a small but complete research synthesis.

**Exercise (mostly solo, you check in at the end):** Using 3–5 real interviews, she should: organize the folder, run her custom commands, produce a tagged dataset, an affinity-style synthesis, and a final findings document — using only what she's learned so far.

**Debrief:** What felt smooth? Where did she get stuck or need to fall back to manual work? Use this to shape Weeks 11+.

---

## Phase 3 — Data, Visuals & Deliverables (Weeks 11–16)

### Week 11 — Working with Survey & Spreadsheet Data
**Goal:** Bring quantitative data (CSV/Excel survey exports) into the same workflow.

**New concepts/commands:**
- Asking Claude to read a CSV/XLSX and describe its structure
- Basic descriptive stats (counts, averages, top responses)
- Connecting quant findings to qual themes from earlier weeks

**Exercise:** Give Claude a survey export. Ask it to summarize the top 5 responses per question, then ask: "Do any of these results support or contradict the themes from our interview synthesis?"

**Make it yours:** Ask Claude to flag any survey results that *surprised* it given the qualitative data.

---

### Week 12 — Visualizing Research Data
**Goal:** Turn findings into simple charts and diagrams for sharing.

**New concepts/commands:**
- Asking Claude to generate a chart from survey data
- Asking Claude to create a simple diagram (e.g., a journey map or theme map)
- Saving visuals alongside written findings

**Exercise:** From the survey data, generate one bar chart of a key question's results. Separately, ask Claude to sketch a simple "theme map" diagram summarizing the Week 7 synthesis.

**Make it yours:** Pick one finding she'd present to stakeholders and have Claude propose 2 different ways to visualize it.

---

### Week 13 — Polished Deliverables (Word/Slides)
**Goal:** Produce stakeholder-ready outputs, not just markdown notes.

**New concepts/commands:**
- Asking Claude to turn a findings doc into a Word document
- Asking Claude to draft a slide outline/deck for a readout
- Light formatting requests (headings, executive summary, appendix)

**Exercise:** Take the Week 10 findings doc and ask Claude to produce both a one-page Word summary and a short slide outline for a team readout.

**Make it yours:** Adjust tone/structure to match a real template her team uses, if she has one.

---

### Week 14 — Specialized "Subagents" for Research Roles
**Goal:** Use focused "personas" for different parts of the research process.

**New concepts/commands:**
- What a subagent is (a specialized assistant for a specific task)
- Setting up a "coder" subagent (tags quotes) vs. a "synthesizer" subagent (writes findings)
- When to use subagents vs. just asking directly

**Exercise:** Set up one subagent focused only on quote-tagging with strict codebook rules, and one focused only on writing executive summaries. Run the same dataset through both and compare to a single general request.

**Make it yours:** Identify one recurring research task of hers that feels like a good fit for a dedicated subagent.

---

### Week 15 — Light Automation
**Goal:** Reduce manual repetitive steps in the workflow.

**New concepts/commands:**
- Simple automation ideas: auto-running a command on new files, batch-processing a folder of transcripts
- Intro to hooks (lightweight — just enough to see the concept, not a deep dive)

**Exercise:** Set up a simple workflow where dropping multiple transcripts into a folder and running one command processes all of them (summary + tags) in one go.

**Make it yours:** Time how long this takes vs. doing it manually one-by-one — useful for showing value to her team later.

---

### Week 16 — Mini-Project 2: Mixed-Methods Pipeline
**Goal:** Combine everything: qualitative + quantitative + visuals + polished output.

**Exercise (mostly solo):** Using a real or sample dataset (a handful of transcripts + a survey export), she independently produces: tagged data, synthesis, one chart, and a polished Word/slide summary — using her custom commands and (if useful) subagents.

**Debrief:** Identify gaps. This shapes Phase 4, which is about turning this into *her own reusable system*.

---

## Phase 4 — Building Her Own Research System (Weeks 17–23)

### Week 17 — Designing a Reusable Research Repo
**Goal:** Create a folder/template structure she can reuse for every new research project.

**New concepts/commands:**
- Designing a standard project structure (e.g., `01-raw-data/`, `02-tagged/`, `03-synthesis/`, `04-deliverables/`)
- A reusable `CLAUDE.md` template for new projects
- Copying a template folder to start a new project

**Exercise:** Design and create a template folder together. Test it by starting a "new fake project" from the template.

**Make it yours:** Refine folder names/structure to match how her team already organizes research, if applicable.

---

### Week 18 — Her Personal Command Library
**Goal:** Consolidate and expand her custom slash commands into a personal toolkit.

**New concepts/commands:**
- Reviewing commands built so far (`/summarize-interview`, `/tag-quotes`, etc.)
- Adding 2–3 new commands based on gaps found in mini-projects
- Organizing commands so they're easy to find/remember

**Exercise:** Audit her current commands, fix any that are clunky, and add at least one new command addressing a Week 16 gap.

**Make it yours:** Write a short "cheat sheet" of her commands and what each does, for her own reference.

---

### Week 19 — Connecting External Tools (MCP)
**Goal:** Pull research artifacts from / push outputs to the tools she already uses.

**New concepts/commands:**
- What MCP connectors are, at a high level
- Connecting one relevant tool (e.g., Notion, Google Drive — whatever she actually uses)
- Asking Claude to pull a doc from that tool or save output back to it

**Exercise:** Connect one tool. Try a round trip: pull a real document in, do something with it, push a result back out.

**Make it yours:** Identify which tool would save her the most time if connected, even if it's not set up today.

---

### Week 20 — Working with Images & Screenshots
**Goal:** Bring visual research artifacts (prototype screenshots, usability test stills, sketches) into the workflow.

**New concepts/commands:**
- Sharing an image with Claude and asking it to describe/analyze it
- Asking Claude to compare two screenshots (e.g., before/after a design change)
- Combining image analysis with written findings

**Exercise:** Share 2–3 screenshots from a usability session or prototype. Ask Claude to note usability concerns visible in each, and fold that into a findings doc alongside interview data.

**Make it yours:** Try this with a real prototype screen she's been testing.

---

### Week 21 — Tackling Bigger, Messier Datasets
**Goal:** Build confidence handling larger or more complex research datasets.

**New concepts/commands:**
- Extended thinking for complex, multi-step analysis requests
- Using Plan Mode for big tasks ("here's 15 transcripts, propose how you'd approach synthesis before doing it")
- Breaking a large task into stages

**Exercise:** Take the largest dataset she has access to (real project, anonymized if needed). Use Plan Mode to have Claude propose an analysis approach, refine the plan together, then execute it in stages.

**Make it yours:** Reflect on how this differs from her usual manual process — what's faster, what needs more care.

---

### Week 22 — Version Control & Collaboration Basics
**Goal:** Learn just enough Git to keep a history of research work and share it with teammates.

**New concepts/commands:**
- What Git is for (a "save history" for folders/files), at a beginner level
- Basic commands: `git init`, `git add`, `git commit`, viewing history
- Sharing a project folder with a teammate (without needing deep Git fluency)

**Exercise:** Turn her template repo (from Week 17) into a Git repo. Make a change, commit it, and look at the history together.

**Make it yours:** Not essential to go deeper here — the goal is just comfort, not mastery.

---

### Week 23 — Assembling "The System"
**Goal:** Put every piece together into one coherent, documented personal system.

**New concepts/commands:** (mostly review/integration)
- Reviewing: template repo, `CLAUDE.md` config, command library, any subagents, any connectors
- Writing a short "how I use Claude Code for research" doc for herself (and future teammates)

**Exercise:** Walk through the full system end-to-end on a small new dataset, from raw transcripts to polished deliverable, using only her own templates/commands/config. Write a one-page guide documenting the system as it stands.

**Make it yours:** Identify 1–2 things she'd still like to improve — these become optional follow-ups after Week 24.

---

### Week 24 — Capstone: Independent Research Project
**Goal:** Demonstrate full independence and set up for continued growth.

**Exercise:** She runs one complete research workflow — from raw data to stakeholder-ready deliverable — entirely on her own, using her personal system, on a real (or realistic) project.

**Wrap-up session:**
- Review the output together
- Discuss what she'd want to learn next (deeper automation? more MCP connectors? more advanced visualizations?)
- Point her to ongoing resources: Claude Code documentation (docs.claude.com), and encourage her to keep iterating on her `CLAUDE.md` and command library as her workflow evolves

---

## Notes on Flexibility
Given variable weekly time, some weeks (especially mini-projects in Weeks 10 and 16, and the capstone in Week 24) may naturally take more than one session. It's fine to let a "week" stretch — the milestones matter more than the calendar. If she's moving faster than expected through Phase 1, weeks 1–3 can be compressed into fewer sessions to leave more room for research-specific work later.
