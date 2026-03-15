# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 portfolio site using the App Router.

### Tech Stack
- Next.js 16 with React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- next-intl for internationalization (EN/DE)
- Lucide React and react-icons for icons

### Path Aliases
`@/*` maps to both `./app/*` and `./*` (defined in tsconfig.json)

### Internationalization (next-intl)
All pages live under `app/[locale]/` with locale-based routing:
- Supported locales: `en` (default), `de` — configured in `i18n/routing.ts`
- Translation files: `messages/en.json`, `messages/de.json`
- Server-side message loading: `i18n/request.ts` (referenced in `next.config.ts`)
- Use `useTranslations('namespace')` in client components, `getTranslations()` in server components
- Locale-aware Link/redirect/usePathname exported from `i18n/routing.ts`

### Theming
The app uses CSS custom properties for light/dark theme support:
- Theme state managed via `ThemeProvider` context (`app/components/ThemeProvider.tsx`)
- Theme toggle uses `data-theme` attribute on `<html>` element
- Access theme with `useTheme()` hook
- Custom colors: `--background`, `--foreground`, `--bg-nav`, `--bg-nav-hover`, `--text-secondary`
- Hydration flash prevented by inline `<script>` in `app/[locale]/layout.tsx` that reads localStorage before paint

### Navigation
- Desktop: Fixed vertical nav on left side
- Mobile: Fixed horizontal nav at bottom
- Active route highlighted with orange accent
- Gooey SVG filter effect (feGaussianBlur + feColorMatrix) for metaball hover animation

### Visual Effects Patterns
Several pages use inline SVG filters and CSS techniques:
- **Math book grid**: Repeating linear gradients as background pattern
- **Dissolve filter**: SVG feTurbulence for noise-based edge dissolving on backgrounds
- **Parallax**: CSS transform driven by scroll position via `useEffect`
- **IntersectionObserver**: Triggers staggered reveal animations on the about/projects pages
- Custom keyframe animations defined in `globals.css`: `gentle-pulse`, `soft-glow`, `float-wave`, `blob-struggle-*`
