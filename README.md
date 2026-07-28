# FOTVG Website — Starter Kit

Project memory, agent skills, and setup runbook for the Friends of the Village Green
website (Astro + Sanity + Netlify).

## What's here

- `CLAUDE.md` — project memory. Drop this at the repo root.
- `.claude/skills/` — six skills. Drop this folder at the repo root.
- `SETUP.md` — phased setup runbook for Windows. Start here.
- `docs/` — seeded decision log, runbook, hosting register, content model.
- `.env.example` — documents variable names only.

## Order of operations

1. Read `SETUP.md` Phase 0 and complete it before writing any code.
2. Copy `CLAUDE.md`, `.claude/`, `docs/`, and `.env.example` into the new repo.
3. Scaffold Astro, commit, push, protect `main`.
4. Connect Netlify, then Sanity.
5. Build.

## The skills

| Skill | Triggers on |
|---|---|
| `fotvg-brand` | Any user-facing copy, alt text, labels |
| `sanity-content-model` | Schema, GROQ, images, Studio config |
| `astro-conventions` | Anything under `src/` |
| `accessibility` | Final pass on any visual change |
| `netlify-ops` | Deploys, env vars, build triggers, DNS |
| `content-migration` | Turning Drive material into site content |

Trim `content-migration` once the initial content load is done. Merge or drop others if
they stop earning their place — a skill nobody reads is worse than no skill.
