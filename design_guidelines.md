# The Modest Wedding - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium booking platforms (Airbnb, Luxury hospitality sites) and wedding planning leaders (The Knot, Zola), creating an elegant, trust-building experience that balances romance with functionality.

**Core Principle**: Sophisticated simplicity - an elevated booking experience that feels special without overwhelming users during their wedding planning journey.

## Typography System

**Primary Font Family**: Playfair Display (Google Fonts) - Serif for headlines and key moments
**Secondary Font Family**: Inter (Google Fonts) - Sans-serif for body text, forms, and UI elements

**Hierarchy**:
- Hero/Main Headers: Playfair Display, 48-64px (desktop), 32-40px (mobile), font-weight 600-700
- Section Headers: Playfair Display, 36-42px (desktop), 28-32px (mobile), font-weight 600
- Subsection Headers: Inter, 24-28px, font-weight 600, letter-spacing -0.02em
- Body Text: Inter, 16-18px, font-weight 400, line-height 1.6
- Labels/Captions: Inter, 14px, font-weight 500
- Buttons/CTAs: Inter, 16px, font-weight 600, letter-spacing 0.02em

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 (mobile), p-8 (tablet), p-12 (desktop)
- Section spacing: py-16 (mobile), py-20 (tablet), py-24 (desktop)
- Card gaps: gap-6 (mobile), gap-8 (desktop)
- Form field spacing: space-y-6

**Container Strategy**:
- Full-width hero: w-full with inner max-w-7xl px-4
- Content sections: max-w-6xl mx-auto px-4
- Form containers: max-w-2xl for single-column flows
- Multi-step wizard: max-w-4xl for side-by-side previews

## Page Structure & Sections

### Homepage/Landing
1. **Hero Section** (80vh): Full-width background image of The Modest Wedding venue, centered content with venue name, tagline, and primary CTA ("Start Planning Your Day"). Overlay with subtle gradient for text legibility. Buttons with backdrop blur.

2. **Wedding Types Overview** (multi-column): 2x2 grid (desktop), stacked (mobile) showcasing the 4 wedding packages - Elopement, Vow Renewal, Friday/Sunday, Saturday. Large card format with package name, brief description, starting price, key inclusions list, and "Select Package" button.

3. **Why Choose The Modest Wedding**: Single column, centered max-w-4xl, 3-4 key differentiators with icons and descriptions. Generous vertical spacing between items (space-y-12).

4. **Venue Showcase**: Image gallery, masonry grid (3 columns desktop, 2 tablet, 1 mobile) showing ceremony space, reception areas, details. 

5. **Testimonials**: 2-column grid (desktop) with quoted testimonials, couple names, wedding dates. Include photo placeholders.

6. **Footer**: Multi-column (3-4 columns desktop, stacked mobile) - Venue contact info, quick links, social media, newsletter signup form.

### Booking Flow (Multi-Step Interface)

**Layout Pattern**: Left sidebar (30% width desktop) shows progress tracker with completed steps checked off. Main content area (70%) displays current step. Mobile: progress bar at top, full-width content below.

**Step 1 - Wedding Type Selection**:
Large cards in 2x2 grid, each card shows package name, detailed description, inclusions list, pricing tier, high-quality package imagery. Active selection highlighted with border treatment.

**Step 2 - Date & Time Selection**:
Split view - Calendar picker on left (or top on mobile), selected date confirmation and available time slots on right. Time slots as button group with clear AM/PM indicators.

**Step 3 - Ceremony Customization**:
Tabbed interface or accordion sections for:
- Ceremony Scripts: Radio button selection with expandable preview of each script type
- Vows Selection: Card-based selection with preview text
- Music Selection: List with play button icons (even if not functional, visual indicator)
- Color Wheel: Embedded color picker component, prominent placement, selected colors displayed as swatches below
- Cake Topper: 3 large image cards showing Traditional, Gentlemen, Ladies options

**Step 4 - Review & Summary**:
Single column layout, all selections displayed in organized sections with edit buttons. Price breakdown clearly itemized. Large, prominent "Proceed to Payment" CTA.

**Step 5 - Payment** (Stripe Integration):
Centered payment form (max-w-md), order summary sidebar on desktop, trust indicators (security badges, SSL notation).

## Component Library

### Cards
- Package Cards: Rounded corners (rounded-lg), subtle shadow (shadow-md), padding p-8, hover lift effect (hover:-translate-y-1 transition)
- Selection Cards: Border-2 style, transparent default, highlighted border when selected
- Review Summary Cards: Outlined style (border), organized with header, content, edit action

### Buttons
- Primary CTA: Large size (px-8 py-4), rounded-lg, prominent placement, full-width on mobile
- Secondary: Outlined style, matching proportions
- Icon Buttons: For edit, delete, info actions - circular (rounded-full), consistent size (h-10 w-10)

### Forms
- Input Fields: Consistent height (h-12), rounded borders (rounded-md), full-width in containers
- Labels: Above inputs, font-weight 500, mb-2
- Radio/Checkbox: Custom styled to match brand aesthetic, larger touch targets (h-6 w-6 minimum)
- Color Wheel: Integrated library component, minimum 300px diameter, centered in section

### Navigation
- Main Nav: Horizontal desktop, hamburger mobile, sticky positioning, subtle shadow on scroll
- Progress Tracker: Vertical stepped timeline (desktop sidebar), horizontal progress bar (mobile top)
- Breadcrumbs: For orientation in multi-step flow

### Data Display
- Pricing Tables: Clean rows with clear hierarchy, highlighted totals
- Selection Summaries: Icon + label + value format, organized in definition lists
- Calendar: Clean month view, disabled past dates, highlighted available dates

### Modals/Overlays
- Confirmation Dialogs: Centered, max-w-md, backdrop blur
- Image Lightbox: For venue gallery, full-screen capability
- Payment Modal: Secure, focused, minimal distractions

## Images Strategy

**Required Images**:
1. **Hero**: Full-width, high-quality image of The Modest Wedding venue ceremony space, romantic and inviting, professional photography
2. **Package Cards**: 4 distinct images representing each wedding type style
3. **Venue Gallery**: 6-8 images showing different venue areas, details, setup examples
4. **Cake Toppers**: Clear product images of Traditional, Gentlemen, Ladies options
5. **Testimonial Photos**: Couple photos to accompany testimonials (can be placeholder avatars)

**Image Treatment**: Consistent aspect ratios (16:9 for hero, 4:3 for cards, 1:1 for avatars), subtle overlay gradients where text overlays images, crisp quality, professionally shot aesthetic.

## Accessibility & Interaction

- Minimum touch target size: 44x44px for all interactive elements
- Clear focus states: visible outline on keyboard navigation
- Form validation: Inline error messages below fields, clear success states
- Loading states: Skeleton screens during data fetch, spinner for payment processing
- ARIA labels: Comprehensive labeling for screen readers
- Color wheel: Ensure selected color has text description for accessibility

## Animation Philosophy

**Minimal, Purposeful Motion**:
- Page transitions: Subtle fade-in (300ms)
- Card hovers: Gentle lift (transform: translateY(-4px), 200ms ease)
- Step progression: Slide animation between booking steps (400ms)
- Loading: Simple spinner, no elaborate animations
- Avoid: Scroll-triggered animations, parallax effects, excessive micro-interactions