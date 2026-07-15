# AGENTS.md

This file helps coding agents work efficiently in this repository with minimal scanning and low-risk edits.

## Repository summary

- Stack: Vite + TypeScript + Three.js
- App entry: `src/main.ts`
- Primary validation command: `npm run build`
- There is no dedicated test suite configured at the moment.

## Fast orientation

- `src/main.ts`
- `src/game/`: game orchestration and camera control
- `src/systems/`: gameplay rules, world generation, movement, combat, progression
- `src/ui/`: DOM rendering, HUD layout, panels, view models, theme helpers
- `src/data/`: static game data
- `src/config/`: top-level game configuration
- `public/`: static assets used at runtime
- `docs/`: design and refactor notes, not source of truth for runtime behavior

## Files and directories agents should usually ignore

Avoid spending tokens scanning these unless the task directly involves them:

- `node_modules/`: dependency code
- `dist/`: build output

## Working norms for this repo

- Prefer minimal, targeted edits over broad refactors.
- Prefer small files where practical, generally under 300 lines unless a larger file is clearly justified.
- Maintain a clear folder structure and place new code in the most specific existing module area.
- Prefer reusable UI components and render helpers over duplicating DOM-building patterns.
- Prefer configuration and data-driven behavior over hardcoded values when the behavior is likely to vary.
- Keep naming consistent with surrounding code and existing domain terms.
- Avoid hidden coupling; make dependencies explicit through parameters, imports, or shared typed state.
- Preserve the current separation of concerns:
  - gameplay logic belongs in `src/systems/`, `src/game/`
  - DOM markup/rendering belongs in `src/ui/`
- If changing UI structure, keep styling and theme tokens consistent with `src/style.css`, `src/ui/theme.css`, and `src/ui/theme.ts` and `docs/UIStyleGuide.md`.
- Favor existing data structures and naming patterns over introducing new abstractions.

## Validation checklist

After code changes, agents should usually:

1. Run `npm run build`.
2. Report any TypeScript or bundling errors clearly.
3. Complete browser verification, especially for UI or rendering work. Use [$game-studio:game-playtest](/Users/leo.tagg/.codex/plugins/cache/openai-curated/game-studio/11c74d6b/skills/game-playtest/SKILL.md) 
4. Check `docs/` for relevant documentation and contractions, updating documents appropriately or creating new documentation aligned to new concepts. The objective is to maintain a repo for specifiaton-driven development 

## Decision rules

- If a task is about layout, HUD panels, dialogs, icons, or menus, inspect `src/ui/` first.
- If a task is about movement, combat, world generation, progression, or ship behavior, inspect `src/systems/` and `src/entities/` first.
- If a file is growing large, split by responsibility before adding more logic.
- Do not modify generated output in `dist/`.

## Good agent responses in this repo

- State which subsystem you touched.
- Keep summaries short and concrete.
- Call out assumptions when behavior depends on workbook data or manual runtime verification.

## Check before implementation 

Before making changes, parse the following files for relevant context and rules

- `docs/UIStyleGuide.md`
- `docs/MVP_Game_Design_Document_v2.md`

Ask any questions that reqiure clarification before making changes. Then update documentation as required. 