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

## Key Features

### Double-Booking Prevention System

**Overview**
A comprehensive three-layer validation system that prevents multiple bookings for the same date/time slot, protecting against both user errors and concurrent payment race conditions.

**Implementation Details**

*Backend Layer*
1. **Storage Methods** (`server/storage.ts`)
   - `getBookedDateTimeSlots()`: Returns all date/time slots where paymentStatus = 'completed'
   - `checkDateTimeAvailability(date, timeSlot, excludeComposerId?)`: Validates if a specific slot is still available
   - Implemented in both MemStorage and DbStorage classes

2. **API Endpoints** (`server/routes.ts`)
   - `GET /api/availability/booked-slots`: Fetch all currently booked slots
   - `POST /api/availability/check`: Check specific date/time availability

3. **Three-Layer Validation Strategy**
   - **Layer 1 (Pre-Checkout)**: Validates availability before creating Stripe checkout session (returns 409 if slot taken)
   - **Layer 2 (Webhook)**: Re-validates availability in Stripe webhook before completing payment (automatic)
   - **Layer 3 (Verify-Payment)**: Re-validates in manual payment verification endpoint (manual fallback)

*Frontend Layer* (`client/src/components/composer/Block2DateTime.tsx`)
- Fetches booked slots from API on component mount
- Calendar component disables fully-booked dates
- Time slot radio buttons disabled for already-booked slots
- Visual indicators show "(Already Booked)" status for unavailable slots
- Real-time updates via React Query cache

**Race Condition Protection**
The system prevents concurrent booking conflicts where two users might simultaneously attempt to book the same slot:
1. User A and User B both see slot as available
2. Both create checkout sessions (Layer 1 passes for both)
3. User A completes payment first → webhook validates and completes booking
4. User B completes payment → webhook re-validates, detects conflict, returns 409
5. User B's payment remains in 'pending' status requiring manual resolution

**Error Handling**
- 409 Conflict responses with descriptive messages when slots are unavailable
- Console logging of booking conflicts for operational monitoring
- Clear user feedback on unavailable dates/times in the UI