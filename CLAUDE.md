@AGENTS.md

## Scope

- Work only on user-interface work: pages, layouts, components, styling, responsive behavior, and UI accessibility.
- Do not change backend routes, server actions, database code, authentication, API integrations, infrastructure, or business logic unless the user explicitly asks.
- Keep changes focused on the requested UI; do not refactor unrelated code.

## Design Direction

- Avoid generic, template-like design. Make deliberate visual choices that fit the product and the existing interface.
- Preserve and extend the existing visual language: typography, color tokens, spacing, radii, shadows, icon style, motion, and component patterns must feel consistent across the app.
- Reuse existing theme variables, design tokens, and shared styles before introducing new values.
- Build responsive, accessible interfaces with semantic HTML, keyboard support, visible focus states, and appropriate labels.

## Components and Libraries

- Inspect `package.json` and the existing codebase before adding UI code.
- Use only libraries that are already declared in `package.json`. Do not install, add, or replace dependencies unless they are genuinely necessary to complete the requested work and the user has approved it.
- Prefer components, primitives, icons, and utilities already included by the project's installed UI library or design system.
- Do not build a button, input, dialog, dropdown, tooltip, select, or other common control from scratch when an equivalent preinstalled library component exists. Create a custom control only when the available library lacks the required capability or design, and keep it consistent with the theme.
- Prefer extending or composing existing shared components over duplicating similar UI.

## Next.js Implementation

- Follow the project's existing Next.js routing, component, and styling conventions.
- Keep client components minimal; use `"use client"` only where interaction or browser-only APIs require it.
- Avoid unnecessary new configuration, packages, assets, and abstractions.
- Verify the changed UI with the project's available lint, typecheck, test, or build commands when practical.
