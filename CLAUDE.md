# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production (static export)
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 portfolio site using the App Router with static export (`output: 'export'`).

### Tech Stack
- Next.js 16 with React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Lucide React for icons

### Project Structure
- `app/` - Next.js App Router pages and components
- `app/components/` - Shared React components
- `app/globals.css` - Global styles and CSS custom properties for theming

### Path Aliases
`@/*` maps to both `./app/*` and `./*` (defined in tsconfig.json)

### Theming
The app uses CSS custom properties for light/dark theme support:
- Theme state managed via `ThemeProvider` context (`app/components/ThemeProvider.tsx`)
- Theme toggle uses `data-theme` attribute on `<html>` element
- Access theme with `useTheme()` hook
- Custom colors: `--background`, `--foreground`, `--bg-nav`, `--bg-nav-hover`, `--text-secondary`

### Navigation
- Desktop: Fixed vertical nav on left side
- Mobile: Fixed horizontal nav at bottom
- Active route highlighted with orange accent
