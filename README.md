# IMovies — MERN Movie Ticket Booking Platform

A responsive movie-ticket booking app built from the supplied project specification. Stack: React 18 + Vite, Bootstrap/SCSS, Express, MongoDB/Mongoose, JWT, and an optional Razorpay payment integration.

## Requirements
- Node.js 18+ and npm
- MongoDB locally or MongoDB Atlas
- Optional: Razorpay test keys and SMTP credentials

## Quick start
1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.
2. In one terminal: `cd server && npm install && npm run dev`
3. In another terminal: `cd client && npm install && npm run dev`
4. Open http://localhost:5173. The API defaults to http://localhost:3000.

To create an admin, set `ADMIN_INVITE_CODE` in `server/.env`, then use the Admin Register screen with that code. Never expose this code publicly.

## Features implemented
- User registration/login, bcrypt password hashing, JWT auth, role-protected admin routes
- Movie browsing/search/filter, movie CRUD, theatre CRUD, show CRUD
- Seat map by tier, booking creation with server-side availability validation, booking history and cancellation
- Favorites and reviews
- Admin dashboard data and booking overview
- Optional Razorpay order creation and signature verification; safe fallback when keys are absent
- Optional SMTP email confirmation; scheduled cleanup of expired pending bookings
- Rate limiting, helmet headers, CORS configuration, request logging, centralized errors, pagination
- Dark “House lights” UI tokens, responsive navigation, accessible seat selection and loading/empty/error states

## API overview
All routes are prefixed `/api`.
- `GET /health`
- `/auth/register`, `/auth/login`, `/auth/me`; `/auth/admin/register`, `/auth/admin/login`
- `/movie` GET/POST and `/movie/:id` GET/PATCH/DELETE
- `/theatre` GET/POST and `/theatre/:id` PATCH/DELETE
- `/shows` GET/POST and `/shows/:id` GET/PATCH/DELETE; `/shows/movie/:movieId`
- `/bookings` GET/POST; `/bookings/:id/cancel`; `/bookings/admin/all`
- `/favorite` GET/POST and `/favorite/:movieId` DELETE
- `/review/movie/:movieId` GET; `/review` POST; `/review/:id` DELETE (owner/admin)
- `/payments/razorpay/order`, `/payments/razorpay/verify`
- `/admin/dashboard`, `/admin/users`

## Payment and seat consistency notes
Seat booking is validated and persisted server-side, and a unique show/seat constraint prevents duplicate booking records. For high-traffic production deployments, use a dedicated seat-hold collection with TTL, MongoDB transactions on a replica set, idempotent payment webhooks, gateway reconciliation, and a distributed job queue. Razorpay credentials and SMTP settings are optional for local development. Never mark a payment successful based only on a client-side result; verify the Razorpay signature on the server.

## Tests
`cd server && npm test` runs API utility/model-level tests that do not require a running database. For end-to-end API tests, configure a disposable MongoDB test database and run the app.

## Production checklist
- Use HTTPS, production MongoDB credentials and a restricted Atlas network policy.
- Set `CLIENT_ORIGIN`, `JWT_SECRET`, and `ADMIN_INVITE_CODE` securely.
- Configure Razorpay webhooks and SMTP; test in sandbox before enabling live keys.
- Set up backups, monitoring, error reporting and a deployment pipeline.
- Do not commit `.env` files.

## Assumptions / source gaps resolved
- Exact endpoint paths and controllers were unspecified; RESTful paths are documented above.
- Admin registration requires `ADMIN_INVITE_CODE` instead of allowing unrestricted public admin creation.
- A show stores seat states by tier and row/seat identifiers. The backend validates seats on booking creation.
- Payment is isolated behind a service and remains disabled until Razorpay credentials are configured.
- Email and reminders are best-effort and are disabled gracefully without SMTP configuration.
- Socket.io is left as an extension rather than pretending live seat broadcasts are implemented.

This is a runnable project foundation, but a deployment must still be configured and verified in its target environment before being described as production-ready.
