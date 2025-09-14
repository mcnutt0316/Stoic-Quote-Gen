# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 TypeScript application that generates and explains Stoic philosophy quotes. The app fetches quotes from an external API (stoic-quotes.com) and uses Groq's AI API to provide simplified explanations of the philosophical content.

## Common Commands

- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - Create production build
- **Production**: `npm start` - Start production server
- **Lint**: `npm run lint` - Run ESLint with Next.js config
- **Type check**: `npx tsc --noEmit` - Check TypeScript types without emitting files

## Dependencies

### Core Dependencies
- **next**: ^15.4.2 - Latest Next.js framework
- **react**: ^19.0.0 - React 19 with concurrent features
- **react-dom**: ^19.0.0 - React DOM renderer

### Development Dependencies
- **@tailwindcss/postcss**: ^4.1.11 - PostCSS integration
- **typescript**: ^5.7.2 - Latest TypeScript with strict mode
- **eslint**: ^9.18.0 with eslint-config-next - Code linting
- **tailwindcss**: ^3.4.17 - Utility-first CSS framework
- **autoprefixer**: ^10.4.20 - CSS vendor prefixes

## Architecture

### App Router Structure
- Uses Next.js 15 App Router with `src/app/` directory
- Server-side rendering for initial quote fetch in `page.tsx:8`
- API route at `/api/explain` for AI-powered quote explanations

### Key Components
- **QuoteCard** (`src/components/QuoteCard.tsx`): Main interactive component
  - Client component with state management for quotes and explanations
  - Handles loading states (`loading`, `explaining`) and error handling
  - Integrates with both external quote API and internal explain API
  - Features skeleton loading states and entrance animations

### API Integration
- **External API**: Fetches quotes from `https://stoic-quotes.com/api/quote` via `fetchRandomQuote()` in `src/lib/api.ts:5`
- **Internal API**: `/api/explain` route uses Groq API (llama-3.1-8b-instant model)
- **Environment**: Requires `GROQ_API_KEY` environment variable
- **Error Handling**: Comprehensive error states and user-friendly messages

### Styling System
- **TailwindCSS** with extensive custom CSS design system
- **Color Palette**: Stone (primary), Gold (accents), Slate (secondary), Sage (success)
- **Typography**: Inter (body) and Playfair Display (headings) via Google Fonts
- **Custom CSS Variables**: Comprehensive design tokens in `src/app/globals.css`
- **Animation System**: Entrance animations with staggered delays
- **Responsive Design**: Mobile-first approach with custom breakpoints

### Design Features
- **Skeleton Loading**: Animated placeholders during content loading
- **Hover Effects**: Subtle micro-interactions on quotes and buttons
- **Gradient Backgrounds**: Warm gradient overlays and button treatments
- **Shadow System**: Multi-layered shadow definitions for depth
- **Glass Morphism**: Backdrop blur effects on quote cards

### Type Safety
- TypeScript with strict mode enabled (`tsconfig.json:7`)
- Simple `Quote` interface in `src/types/quote.ts:1-4`
- Path aliases configured: `@/*` maps to `./src/*`

### State Management
- React useState for local component state (quotes, explanations, loading states)
- No global state management - simple app structure suits the use case
- Loading and error states handled in QuoteCard component

## Development Notes

- Uses `'use client'` directive only where needed (QuoteCard component)
- Server components used by default for better performance
- Error boundaries handled at component level with user-friendly messages
- API responses include proper HTTP status codes and error handling
- Custom CSS-in-JS approach with extensive design system variables