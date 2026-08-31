# Mangala Arangam — Frontend (Customer Booking Flow)

React + Vite + Tailwind + Framer Motion frontend for the Mangala Arangam
wedding hall booking platform. This pass covers the **customer journey end
to end**, wired to mock data so every screen is fully clickable without a
backend yet, with a fully animated, modern UI layer on top.

## Design direction

Grounded in Tamil wedding culture rather than a generic "SaaS booking" look:

- **Colors** — kumkum/vermilion red (`#7A1B3D`) as primary, temple gold
  (`#C9962B`) as accent, ivory background, a small amount of banana-leaf
  green and blush pink.
- **Type** — `Fraunces` (a warm display serif) for headings, `Manrope` for body text.
- **Signature motifs** — a mandapam-arch image frame (`.arch-frame` in
  `index.css`) used for every hall photo instead of a plain rounded
  rectangle, and a kolam-style dotted divider (`.kolam-divider`) used in
  place of plain hairlines between sections.

## Motion layer

Built with `framer-motion` throughout, using a shared `Reveal` /
`RevealGroup` / `RevealItem` helper (`src/components/Reveal.jsx`) for
scroll-triggered entrances, so the same animation language repeats
consistently across every page:

- **Hero** — staggered line-by-line headline reveal, slow-drifting gradient
  blobs, animated search bar entrance.
- **Navbar** — shrinks and gains a blurred background on scroll, animated
  underline on nav links, spring-based mobile menu.
- **Route transitions** — every page fades/slides in via `AnimatePresence`.
- **Cards & grids** — hover lift + image zoom on hall cards, staggered grid
  reveals on listings, `layout` animations when items are removed
  (wishlist) or re-sorted (halls).
- **Calendar** — sliding month transitions, pulsing selection ring.
- **Status badges** — a pulsing dot on "available / confirmed / paid" states.
- **Forms & flows** — animated field focus, spring buttons, a celebratory
  ripple + checkmark on booking confirmation, an animated payment-method
  selector with a spinning loader state.
- **Stats** — animated count-up numbers on the homepage stats strip.

All animations respect `prefers-reduced-motion` (see `index.css`).

## What's included

Pages: Home, Wedding Halls (list + filter/sort), Hall Details (gallery,
facilities, live-style availability calendar, reviews), Booking, Booking
Confirmation, Payment, My Bookings (tabbed), Booking Details, Wishlist,
Login, Register, Profile, About, Contact.

`/owner/*` and `/admin/*` routes exist and render a placeholder screen —
those dashboards are the next build phase, as agreed.

All data currently comes from `src/data/mockHalls.js` and
`src/data/mockBookings.js`, shaped to match the REST API structure in the
original spec (`GET /api/halls`, `POST /api/bookings`, etc.) so swapping in
real API calls later is mostly a matter of replacing the mock imports with
`axios` calls in a `src/services/` layer.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Visit the printed local URL (default `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Next steps

1. Hall Owner dashboard (My Halls, Add/Edit Hall, Availability & Status
   management, Booking Requests, Revenue, Reviews).
2. Admin dashboard (Manage Customers/Owners/Halls, Approvals, Complaints).
3. Spring Boot backend + MySQL, replacing the mock data layer with real
   `axios` calls and JWT-based auth.

