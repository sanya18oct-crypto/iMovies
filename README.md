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

## Live demo deployment

The live client is deployed to GitHub Pages; the API runs on Render and the database on MongoDB Atlas. GitHub Pages cannot run the Express server or MongoDB.

1. Create a MongoDB Atlas database and allow network access from Render (for a demo, `0.0.0.0/0` is easiest; use a restricted network policy for production). Create a database user and copy its connection string.
2. In Render, create a Blueprint from this repository using `render.yaml`. Set `MONGO_URI` to the Atlas connection string. Render generates `JWT_SECRET` and `ADMIN_INVITE_CODE`. After deployment, copy the API service URL, for example `https://imovies-api.onrender.com`.
3. In GitHub, open **Settings → Secrets and variables → Actions → Variables**, create `VITE_API_URL` with the API URL followed by `/api` (for example `https://imovies-api.onrender.com/api`).
4. In Render, set the API service's `CLIENT_ORIGIN` to `https://sanya18oct-crypto.github.io` (and any local development origin needed), then redeploy the API.
5. In GitHub, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**. Push to `main` or run the **Deploy client to GitHub Pages** workflow manually.
6. Once the workflow succeeds, the demo URL is `https://sanya18oct-crypto.github.io/iMovies/`. Routes use hash URLs (for example `/#/home`) so refresh/deep links work on Pages.

The free Render API may sleep when idle, so the first request can take a little while. Configure Razorpay credentials in Render only if you want to test payments; never put server secrets in GitHub Pages variables or the client bundle.

## Features implemented
- User registration/login, bcrypt password hashing, JWT auth, role-protected admin routes
- Movie browsing/search/filter, movie CRUD, theatre CRUD, show CRUD
- Seat map by tier, booking creation with server-side availability validation, booking history and cancellation
- Favorites and reviews
- Admin dashboard data and booking overview
- Optional Razorpay UPI Checkout with server-side order creation and signature verification; Checkout opens UPI intent on supported phones and displays a QR code on desktop, with a safe fallback when keys are absent
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
- `/bookings` GET/POST; `/bookings/:id/cancel`; `/bookings/admin/all`; `/bookings/admin/:id/mark-paid` (admin manual UPI verification)
- `/favorite` GET/POST and `/favorite/:movieId` DELETE
- `/review/movie/:movieId` GET; `/review` POST; `/review/:id` DELETE (owner/admin)
- `/payments/razorpay/order`, `/payments/razorpay/verify`
- `/admin/dashboard`, `/admin/users`

## Payment and seat consistency notes
Seat booking is validated and persisted server-side, and a unique show/seat constraint prevents duplicate booking records. For high-traffic production deployments, use a dedicated seat-hold collection with TTL, MongoDB transactions on a replica set, idempotent payment webhooks, gateway reconciliation, and a distributed job queue. Razorpay credentials and SMTP settings are optional for local development. Set a matching Razorpay Key ID and Key Secret from the same Test or Live mode in `server/.env`; Checkout uses Razorpay's merchant account and its configured settlement bank account, not a personal UPI ID. UPI intent is available on supported phones and Checkout displays a QR code on desktop. Never mark a payment successful based only on a client-side result; verify the Razorpay signature on the server. Admins can manually mark a booking paid only after independently verifying an external UPI transfer; the app records the transaction reference and verifying admin but does not validate the transfer with a bank.

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
