# Requirements-to-implementation checklist

This matrix maps the uploaded IMovies specification to the generated code. A feature listed as implemented means code is present; it does not imply deployment or external credentials have been configured.

| Requirement | Implementation | Verification / limitation |
|---|---|---|
| MERN client/server layout | `client/`, `server/`, Vite + React, Express + Mongoose | JSX and server JavaScript syntax checked; full npm build not run because dependency installation timed out in this environment |
| House lights theme | `client/src/styles/_tokens.scss`, `main.scss`, Bricolage Grotesque + Figtree | Theme tokens and responsive styles included; Lighthouse not run |
| User registration/login | `server/controllers/authController.js`, `server/routes/authRoutes.js`, `AuthContext.jsx` | bcrypt hashing, JWT; requires configured MongoDB and `JWT_SECRET` |
| Admin role and protected routes | `fetchUser.js`, `requireRole`, admin invite-code registration | Set `ADMIN_INVITE_CODE`; admin registration is not open to arbitrary public signups |
| Movie CRUD/search/pagination | `movieController.js`, `movieRoutes.js`, `Home`, `Admin` | Movie text search, genre/language/rating filters and pagination; location/date/theatre filtering are available via show endpoints, not fully integrated into the home filter UI |
| Theatre CRUD | `theatreController.js`, `theatreRoutes.js`, `AdminResource` | Admin create/update/deactivate; seat tier dimensions and prices stored |
| Show CRUD | `showController.js`, `showRoutes.js`, `AdminResource` | Date/time validation and exact same-slot conflict check; duration-based overlapping shows are not computed |
| Seat selection and availability | `SeatMap.jsx`, `SeatReservation.js`, `bookingController.js` | Unique `(show,tier,row,number)` reservation index protects against concurrent duplicate holds; holds expire after 10 minutes |
| Maximum eight seats | `bookingController.js`, `SeatsPage` | Enforced in client and server |
| Booking history/cancellation | `bookingController.js`, `Bookings`, `TicketCard` | Pending bookings can be cancelled; paid-ticket cancellation/refunds are deliberately not automated and require an admin/support workflow |
| Razorpay payment | `paymentController.js`, payment routes, Razorpay checkout in `Bookings` | Requires test keys; signature verification is server-side; payment/webhook reconciliation still needs deployment configuration |
| Favorites | `favoriteController.js`, `Favorite.js`, `Favorites`, `MovieCard` | Add/remove/list for authenticated user |
| Reviews and moderation | `reviewController.js`, `Review.js`, `MovieDetails` | One review per user/movie; owner or admin can delete; average movie rating updated |
| Email confirmation | `utils/mailer.js`, booking payment confirmation | SMTP is optional and silently disabled when credentials are absent; verify transport in deployment |
| Show reminders and cleanup | `reminderService.js`, `cleanupService.js`, cron in `server.js` | Cleanup releases expired pending reservations; reminder job is best-effort and should be upgraded with delivery tracking to avoid duplicate sends |
| Admin dashboard/reports | `adminController.js`, `Admin` | Summary counters and movie management; revenue charts and advanced reporting from the spec remain incomplete |
| Input validation/errors/rate limiting/logging | Zod schemas, central middleware, express-rate-limit, Helmet, Morgan | Syntax checked; runtime API tests require dependencies and MongoDB |
| Keyboard/accessibility/reduced motion | Seat `aria-label`, button states, focus-visible and reduced-motion CSS | Basic affordances present; formal screen-reader and Lighthouse testing remains to be done |
| Socket.io real-time seat broadcasts | Not implemented | Intentionally left optional, consistent with spec's build order |
| QR code and downloadable PDF ticket | Print-friendly ticket UI | Browser print is implemented; QR code/PDF generation is not yet wired |
| CI/CD and deployment | README deployment checklist | Provider-specific deployment and CI configuration not generated or verified |

## Known implementation boundaries

- This is a functional full-stack starting point, not a claim of audited production readiness.
- Booking holds use a unique reservation collection. For strict all-or-nothing multi-seat reservations at scale, use MongoDB transactions on a replica set and an idempotent reservation service.
- Razorpay requires valid keys and ideally a signed webhook endpoint plus reconciliation for delayed or duplicate gateway events.
- Frontend JWT is held in a JavaScript-readable cookie because the supplied specification names `js-cookie`; a hardened production deployment should prefer server-set HttpOnly, Secure, SameSite cookies with CSRF protections.
- Seed/demo movie data is not included; add movies through the admin account or a trusted seed script.
