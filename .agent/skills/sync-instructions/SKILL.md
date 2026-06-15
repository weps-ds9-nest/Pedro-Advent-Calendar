# Skill: Sync Instructions

Automatically synchronizes development rules and guidelines between the agent definition (`AGENT.md`) and the master IDE instructions (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`).

## Capabilities
- **Single Source of Truth**: Uses the `AGENT.md` persona, rules, and triggers as the primary definition.
- **Auto-Generation**: Writes/syncs all IDE instruction configurations.
- **Consistent Constraints**: Ensures that any developer (AI or human) uses the exact same tech stack references, file maps, and routing/auth rules.
