# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style Guidelines
- Use TypeScript with strict types
- Follow React/Next.js best practices
- Use Tailwind CSS for styling
- Organize imports: React/Next, libraries, local files
- Use "use client" directive for client components
- Prefer functional components with hooks
- Use early returns for cleaner code
- Keep components focused and modular

## Firebase/Authentication
- Admin email is set via `NEXT_PUBLIC_ADMIN_EMAIL` env variable
- All Firebase config is handled through environment variables
- Google authentication is the primary auth method
- Admin users can see all bookings, regular users only see their own

## Project Structure
- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/src/contexts` - React contexts
- `/src/lib` - Utility functions and Firebase config
- `/src/types` - TypeScript type definitions
- `/src/styles` - Global styles and CSS modules