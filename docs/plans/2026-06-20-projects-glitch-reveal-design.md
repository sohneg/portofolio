# Projects List — Glitch Reveal Interaction

Date: 2026-06-20
Status: Approved

## Goal

On the projects page, hide each project's description by default and reveal it on
interaction with the title. Tech stack tags and links stay visible at all times.
Add affordances that signal the title is interactive.

## Decisions

- **Layout:** Collapsed by default — card shows only title + tech tags + links.
  Description expands (height animation) on reveal and pushes following projects down.
- **Trigger:** Desktop = hover the card; Mobile/touch = tap the title (toggle).
  Multiple projects can be open at once.
- **Reveal effect:** "Glitch In" — brief RGB-split jitter that settles, plus opacity fade.
- **Glitch colors:** Brand-tuned — orange (`#f97316`) / cyan (`#22d3ee`) split (not classic red/cyan).
- **Affordances:**
  - `▸` chevron next to the title, rotates 90° when open.
  - Orange underline grows from a short stub to full width when open.
  - Page-level hint under the "Projects" heading ("hover/tap a title…"), fades out
    after the first interaction.
- **Auto-teaser:** ~1 s after load, the **first** project title glitches once (title only)
  as a hint that titles are interactive. Runs only once.

## Implementation

- Convert the per-project item into a client component `app/components/ProjectCard.tsx`
  (`'use client'`). It calls `useTranslations('projects')` and owns:
  - `open = hovered || pinned` (hover sets `hovered`; clicking the title toggles `pinned`).
  - First-interaction callback to the parent (to fade the page hint).
  - Auto-teaser for the first card (title glitch after ~1 s).
- The projects page becomes a client component holding shared `hasInteracted` state +
  the page hint, mapping `projects` to `<ProjectCard>`. Timeline dot, `ThoughtBubble`,
  vertical line, and the dissolve notebook-grid background are unchanged.
- Height collapse via CSS grid rows (`grid-template-rows: 0fr → 1fr`) on a wrapper
  around the description; inner `overflow-hidden min-h-0`.
- Glitch keyframes (`glitch-in`, orange/cyan) live in `globals.css`, reused by both the
  description reveal and the title teaser.

## Accessibility

- Title rendered as a `<button>` with `aria-expanded`.
- `@media (prefers-reduced-motion: reduce)` disables the glitch jitter — description
  just fades in; teaser is skipped.

## Out of scope (YAGNI)

- No accordion (multiple-open is fine).
- No persistence of open/closed state across navigations.
- No per-project effect customization.

## New i18n keys

- `projects.hint` (EN/DE) — the page-level interaction hint.
