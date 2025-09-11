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

## Architecture

### App Router Structure
- Uses Next.js 15 App Router with `src/app/` directory
- Server-side rendering for initial quote fetch in `page.tsx`
- API route at `/api/explain` for AI-powered quote explanations

### Key Components
- **QuoteCard**: Main interactive component (`src/components/QuoteCard.tsx`)
  - Client component with state management for quotes and explanations
  - Handles loading states and error handling
  - Integrates with both external quote API and internal explain API

### API Integration
- **External API**: Fetches quotes from `https://stoic-quotes.com/api/quote`
- **Internal API**: `/api/explain` route uses Groq API (llama-3.1-8b-instant model)
- **Environment**: Requires `GROQ_API_KEY` environment variable

### Styling
- TailwindCSS with stone color palette for elegant, philosophical theme
- Google Fonts: Inter (primary) and Playfair Display (headers)
- Responsive design with mobile-first approach
- Custom font variables defined in layout

### Type Safety
- TypeScript with strict mode enabled
- Simple `Quote` interface in `src/types/quote.ts`
- Path aliases configured: `@/*` maps to `./src/*`

### State Management
- React useState for local component state
- No global state management (Redux/Zustand) - simple app structure
- Loading and error states handled in QuoteCard component

## Development Notes

- Uses `'use client'` directive only where needed (QuoteCard component)
- Server components used by default for better performance
- Error boundaries handled at component level with user-friendly messages
- API responses include proper HTTP status codes and error handling