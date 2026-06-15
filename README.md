# Pedro Pascal Advent Calendar 🎄

An interactive Next.js application that guides learners through web development lessons in advent calendar format.

## Documentation
- [System Architecture](docs/PROJECT.md)
- [Architectural Decision Records & Roadmap](docs/DECISIONS.md)
- [Feature Progression Tracker](docs/PROGRESS.md)
- [Lesson Data Schema](docs/LESSONS_SCHEMA.md)

---

## Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
# Set to true to bypass login authentication locally (forces admin access)
DEV_MODE=true

# Passwords for credentials testing
USER_PASSWORD=studentpass
ADMIN_PASSWORD=adminpass
```

### 2. Run the Development Server
Install dependencies and run the server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application dashboard.

---

## Backstage AI Assistant
The project features a built-in assistant located in `.agent/` to run backstage task scripts and automation.

### Compile Lessons
To convert your markdown lessons from the single `lessons.md` file (or individual markdown files in `content/lessons/`) into the active JSON database:
```bash
npm run agent
```

### Manage Skills
Skills are modular directories located under `.agent/skills/`. To run a specific skill, pass its folder name:
```bash
npm run agent md-to-json
```
Stubs exist for `impeccable` and `front-end-design` skills, which can be configured for remote or local workflows.
