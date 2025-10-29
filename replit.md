# The Modest Wedding - Wedding Booking Platform

## Overview

The Modest Wedding is a full-stack web application for booking wedding ceremonies. It provides a multi-step booking flow where couples can select wedding packages (Elopement, Vow Renewal, Friday/Sunday, Saturday), customize ceremony details (scripts, vows, music, colors, cake toppers), and complete payment via Stripe. The application features an elegant, premium design inspired by luxury booking platforms like Airbnb and wedding planning sites like The Knot.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for client-side routing (lightweight React Router alternative)
- React Query (@tanstack/react-query) for server state management and API data fetching

**UI Component System**
- shadcn/ui component library (Radix UI primitives with Tailwind styling)
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows "new-york" style from shadcn/ui
- Typography: Playfair Display (serif) for headlines, Inter (sans-serif) for body text
- Custom color system using CSS variables for theming (light/dark mode support)

**State Management**
- React Query for server state (bookings, payment verification)
- Local component state with useState for form inputs and UI state
- No global state management (Redux/Zustand) - relies on React Query cache and component props

**Form Handling**
- React Hook Form with Zod validation (@hookform/resolvers)
- Multi-step wizard pattern for booking flow (5 steps: Package → Date/Time → Customize → Contact Info → Review)
- Inline validation and error handling

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- ESM modules (type: "module" in package.json)
- Custom Vite integration for SSR/development mode

**API Design**
- RESTful endpoints under `/api` prefix
- Key endpoints:
  - `POST /api/bookings` - Create new booking
  - `GET /api/bookings/:id` - Retrieve booking details
  - `POST /api/create-checkout-session` - Initiate Stripe payment
  - `POST /api/webhook` - Stripe webhook handler (raw body parsing)
- Request logging middleware with duration tracking
- Error handling middleware for consistent error responses

**Data Layer**
- PostgreSQL database storage via `DbStorage` implementation
- Interface-based design (`IStorage`) allows flexibility in storage backend
- Drizzle ORM for type-safe database queries

### Data Storage Solutions

**Database (Active)**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries
- Schema includes:
  - `users` table: id, email, password, authProvider, displayName, createdAt
  - `wedding_composers` table: comprehensive wedding booking data with 12 blocks of composer selections
  - `bookings` table: legacy booking data (for backwards compatibility)
- Migration setup via drizzle-kit (schema in `shared/schema.ts`)

**Session Management**
- connect-pg-simple for PostgreSQL-backed sessions
- Session configuration ready for authentication flows

**Current Storage**
- PostgreSQL database with persistent data storage
- All user accounts and wedding composer selections saved permanently
- Legacy MemStorage class available but not in use

### Authentication and Authorization

**Current State**
- User schema defined but no active authentication implemented
- Placeholder routes exist for user creation/retrieval
- No session management or protected routes currently active

**Prepared Infrastructure**
- User table schema with username/password fields
- Session storage configured for PostgreSQL
- Ready for future implementation of login/signup flows

### External Dependencies

**Payment Processing**
- Stripe integration (@stripe/stripe-js, @stripe/react-stripe-js)
- Stripe API version: 2025-09-30.clover
- Checkout session flow: Create session → Redirect to Stripe → Webhook verification
- Environment variables: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`
- Raw body parsing for webhook signature verification

**Database**
- Neon serverless PostgreSQL (active and provisioned)
- Connection via `DATABASE_URL` environment variable
- Drizzle ORM for schema management and queries
- Database push command: `npm run db:push` (no manual migrations needed)

**Development Tools**
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-overlay)
- TypeScript compilation via tsx for server runtime
- esbuild for production builds

**Third-Party UI Components**
- Radix UI primitives (comprehensive set: accordion, alert-dialog, calendar, checkbox, dialog, dropdown, popover, radio-group, select, toast, etc.)
- date-fns for date manipulation
- react-day-picker for calendar component
- Lucide React for iconography
- class-variance-authority for component variants
- tailwind-merge for className composition

**Fonts**
- Google Fonts: Playfair Display, Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono (loaded via CDN in index.html)