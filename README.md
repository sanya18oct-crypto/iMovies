# IMovies — MERN Movie Ticket Booking Platform
## Project Specification (AI-Ready Build Brief)

> **Version note (UI update):** This version adds **Section 10A (UI/UX Design System)** and updates Sections 0, 2, 6, 10.3, 12, 14 and 16 to point to it. No backend or Section 2 decision was changed; the Bootstrap + SCSS decision is kept and extended with a theming rule.

> **How to use this file:** Upload it to an AI model and say: *"Read this spec fully, then build the project step by step, starting with Section 14 (Build Order). Ask me before changing any decision in Section 2."*

---

## 0. Instructions for the AI Assistant

- Treat this document as the **single source of truth** for the project.
- Build in the order given in **Section 14**. After each step, tell me what files were created and how to run/test them.
- Follow the **MVC structure** (Section 7) and the **folder layout** (Section 6).
- Where this spec says *"Optional"*, build the core first and add the optional part last.
- If something is ambiguous or conflicts, use the **Decisions & Resolved Conflicts** table in Section 2 — do not guess.
- Give complete, copy-paste-ready code files, not fragments.
- For anything visual (layout, colour, type, spacing, motion, copy), follow **Section 10A** exactly. Do not fall back to default Bootstrap styling.

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Name** | IMovies |
| **Tagline** | Movie ticket booking made simple |
| **Category** | Entertainment |
| **Type** | Individual project |
| **Stack** | MERN (MongoDB, Express.js, React.js, Node.js) |
| **Architecture** | Client–server, REST API, MVC on the backend |
| **Estimated effort** | ~17h (Architecture 1h, Backend 7h30m, Schemas 1h40m, Frontend 7h30m, plus small stories) |

**Summary:** IMovies is an online cinema platform where users browse movies, pick a theatre and showtime, choose seats with real-time availability, pay, and receive a booking confirmation. Admins manage movies, theatres, shows, and monitor bookings. Authentication uses JWT with User and Admin roles.

### Skills / Technologies
HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, Asynchronous JavaScript, JWT, Bootstrap

### Expected Outcomes
- Production-ready full-stack MERN booking app
- Secure role-based authentication and booking workflows
- Real-time seat management and payment integration
- Responsive React UI
- Clean backend architecture, database design, and REST APIs

---

## 2. Decisions & Resolved Conflicts

The original document contained leftover text from other projects and inconsistent values. Use these resolutions:

| Topic | Conflict in source | **Use this** |
|---|---|---|
| App name | Some text says "JobPortal", "agricultural platform", "farms" | **IMovies** (movie ticket booking). Ignore job/farm/agri wording |
| Backend entry file | `index.js` vs `server.js` | **`server.js`** (matches the reference folder screenshot) |
| Backend port | 8000 (steps) vs 3000 (code) | **Use `PORT` from `.env`, default `3000`** |
| Frontend folder name | `client` vs `frontend` | **`client`** at project level (see Section 6) |
| Backend folder name | `server` vs `backend` | **`server`** at project level |
| Frontend scaffolding | Vite vs CRA | **Vite + React (JavaScript)** |
| Styling | Tailwind vs Bootstrap vs Material UI vs SCSS | **Bootstrap + SCSS modules per page** (reference code uses `style.scss`) |
| UI direction | Spec had no visual design rules | **Section 10A "House lights"** design system, built *with* Bootstrap + SCSS by overriding Bootstrap variables with the 10A tokens |
| Sample UI text | "products", "orders", "courses", "students/instructors" | Replace with **movies, bookings, shows, users/admins** |
| Real-time seats | Socket.io marked "optional" | Build core booking with seat validation first; add Socket.io last |
| Payments | Stripe / Razorpay / PayPal | **Razorpay (default)**; keep payment code behind a service so it can be swapped |

---

## 3. System Requirements

### Software
| Tool | Requirement |
|---|---|
| OS | Windows 10/11, macOS, or Linux |
| Node.js | v16 or above (https://nodejs.org/) |
| npm | v8 or above |
| MongoDB | Community Server (https://www.mongodb.com/try/download/community) or MongoDB Atlas |
| Browser | Latest Chrome or Firefox |
| Postman | API testing |
| VS Code | Recommended editor |
| Git | Version control |

### Hardware (minimum)
CPU Intel i5 8th gen / Ryzen 5 · RAM 8 GB (16 GB recommended) · 1 GB free disk · 1366×768 display

---

## 4. Features

### 4.1 Core Features
1. **User registration & authentication** — sign up, log in, log out (JWT)
2. **Movie listings** — title, genres, language, duration/runtime, rating/certification, cast, release date, description, media
3. **Theatre & show management (admin)** — add theatres, add shows (movie + theatre + date + time)
4. **Seat selection & availability** — seat layout per show; unavailable seats cannot be selected
5. **Ticket booking management** — confirm booking, booking history, cancellation
6. **Secure payment** — multiple options, payment status tracking, success/failure handling
7. **Watchlist / Favorites** — save movies
8. **Reviews & ratings** — users rate and review movies
9. **Admin dashboard** — manage movies, theatres, shows, bookings, users
10. **Notifications** — email confirmation, payment receipt, show reminders (SMS optional)

### 4.2 User Capabilities
- Register and manage a personal account
- Browse movies and show timings
- Search and filter by **genre, language, rating, theatre, location, date**
- Select seats, confirm booking, pay
- View booking history and upcoming shows
- Maintain a favorites list and write reviews

### 4.3 Admin Capabilities
- Add / update / delete movies, theatres, and shows
- Monitor seat availability and booking status
- Manage users and resolve booking issues
- Track payments and generate revenue reports
- Moderate reviews

### 4.4 User Flow
1. Register or log in
2. Browse movies, choose one
3. Choose theatre, date, and show time
4. View seat layout with live availability
5. Select seats and review booking (seats, show details, total)
6. Confirm → make payment
7. If payment fails → retry or choose another method; if it succeeds → booking confirmed, e-ticket generated
8. Notification sent (email / SMS / in-app)
9. View booking history and upcoming shows
10. Rate and review the movie

### 4.5 Admin Flow
1. Log in to admin dashboard
2. Manage movies, theatres, show schedules
3. Monitor seat availability and active bookings
4. Track payments, reports, feedback
5. Moderate reviews

### 4.6 Entity Connections
```
Movie   → Show → Seat
User    → Booking → Payment
Booking → Show → Seat
User    → Review → Movie
Admin   → manages Movie / Show / Theatre
Payment → Booking confirmation
```

---

## 5. Technical Architecture

```
React (Vite) client  ⇄  REST API (Express/Node)  ⇄  MongoDB (Mongoose)
                              │
                              ├─ JWT auth + role middleware
                              ├─ Payment gateway service
                              ├─ Email/SMS notification service
                              └─ (Optional) Socket.io for live seats
```

### 5.1 Frontend (client)
- **React.js + Vite** — UI
- **Bootstrap + SCSS** — styling (Tailwind/Material UI/Ant Design acceptable only if explicitly requested)
- **React Router** — pages: Home, Movies, Shows, Seats, Bookings, Profile
- **Axios** — API calls
- **JWT handling** — token stored in cookies (`js-cookie`)
- **WebSockets** *(optional)* — real-time seat updates
- **Modules:** auth, movie/show browsing with filters, seat selection, booking management, profile & favorites, payment & confirmation UI

### 5.2 Backend (server)
- **Node.js + Express.js** — REST API
- **JWT** — authentication/authorization
- **bcrypt.js** — password hashing
- **Mongoose** — ODM
- **Socket.io** *(optional)* — seat lock/unlock updates
- **Services:** Auth, User, Movie & Show, Seat Management, Booking, Payment, Notification

### 5.3 Database (MongoDB)
Collections: `Users`, `Admins`, `Movies`, `Theatres`, `Shows`, `Bookings`, `Favorites`, `Reviews` (+ `Payments`, `Seats`, `Notifications` as extensions — see Section 8.2)

### 5.4 Payment Flow
1. User selects payment method
2. Frontend calls backend payment API
3. Backend talks to gateway
4. Gateway confirms → backend updates booking status
5. Confirmation sent (email/SMS/in-app)

### 5.5 Real-Time Seat Management
- User selects seats → backend places a **temporary seat lock (with TTL)**
- Payment success → seats marked **booked**
- Payment failed/cancelled → seats **released automatically**
- Socket.io broadcasts unavailable seats to other users instantly

### 5.6 Deployment
| Part | Options |
|---|---|
| Frontend | Vercel / Netlify / AWS S3 + CloudFront |
| Backend | Render / AWS EC2 / Heroku |
| Database | MongoDB Atlas |
| CI/CD | GitHub Actions / GitLab CI |
| Monitoring | PM2, logging, Sentry / ELK |

### 5.7 Security
- HTTPS for all API traffic
- JWT auth + **role-based access (User, Admin)**
- bcrypt password hashing
- Input validation and sanitization (XSS, injection)
- API rate limiting and throttling
- Protected routes (backend middleware + frontend route guards)

---

## 6. Project Folder Structure

```
imovies/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx              # Routes (lazy-loaded pages)
│   │   ├── host.js              # exports `render` (API base URL)
│   │   ├── main.jsx             # imports styles/main.scss once
│   │   ├── styles/              # design system (Section 10A)
│   │   │   ├── _tokens.scss     # Bootstrap overrides + CSS variables
│   │   │   ├── _mixins.scss
│   │   │   └── main.scss
│   │   ├── hooks/
│   │   │   └── useFetch.js
│   │   ├── components/
│   │   │   ├── header/Header.jsx        # top nav (desktop) + bottom tab bar (mobile)
│   │   │   ├── footer/Footer.jsx
│   │   │   ├── loader/Loader.jsx        # PageLoader, PosterSkeleton, RowSkeleton
│   │   │   ├── movieCard/MovieCard.jsx
│   │   │   ├── filterBar/FilterBar.jsx
│   │   │   ├── showtimeChip/ShowtimeChip.jsx
│   │   │   ├── seatMap/SeatMap.jsx      # shared by SeatsPage and AddTheatre preview
│   │   │   ├── bookingSummary/BookingSummary.jsx
│   │   │   ├── ticketCard/TicketCard.jsx
│   │   │   ├── emptyState/EmptyState.jsx
│   │   │   ├── confirmDialog/ConfirmDialog.jsx
│   │   │   └── adminLayout/AdminLayout.jsx
│   │   │   └── protection/
│   │   │       ├── UserProtection.jsx
│   │   │       └── AdminProtection.jsx
│   │   └── pages/               # each page has its own style.scss
│   │       ├── landing/Landing
│   │       ├── login/Login, AdminLogin
│   │       ├── register/Register, AdminRegister
│   │       ├── home/Home
│   │       ├── movieDetails/MovieDetails
│   │       ├── movieShows/MovieShows
│   │       ├── seatsPage/SeatsPage
│   │       ├── bookings/Bookings
│   │       ├── favoriteShows/FavoriteShows
│   │       ├── profile/Profile
│   │       ├── editUserDetails/EditUserDetails
│   │       ├── admin/Admin
│   │       ├── addMovie/AddMovie
│   │       ├── addShow/AddShow
│   │       ├── addTheatre/AddTheatre
│   │       └── adminBookings/AdminBookings
│   └── package.json
│
└── server/                      # Express backend
    ├── server.js                # entry point
    ├── .env  /  .env.example
    ├── .gitignore
    ├── middlewares/
    │   └── fetchUser.js         # JWT verification middleware
    ├── models/
    │   ├── adminModel.js
    │   ├── bookingModel.js
    │   ├── favoriteModel.js
    │   ├── movieModel.js
    │   ├── reviewModel.js
    │   ├── showModel.js
    │   ├── theatreModel.js
    │   └── userModel.js
    ├── routes/                  # "View" layer in this project's MVC
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── favoriteRoutes.js
    │   ├── movieRoutes.js
    │   ├── reviewRoutes.js
    │   ├── showRoutes.js
    │   └── theatreRoutes.js
    ├── controllers/             # business logic (add per route group)
    └── utils/
        ├── mailer.js            # exports verifyTransport + email sending
        ├── reminderService.js   # exports sendReminderEmails
        └── cleanupService.js    # exports cleanupOldBookings
```

---

## 7. MVC Pattern (Backend)

| Layer | Implementation | Responsibility |
|---|---|---|
| **Model** | Mongoose schemas in `models/` | Data structure and DB operations |
| **View** | Express routes in `routes/` | Define endpoints (GET/POST/PUT/DELETE), call controllers |
| **Controller** | Functions in `controllers/` | Receive request, validate/transform, call models, return response |

Benefits: separation of concerns, scalability, reusability, independent testing, team-friendly.

---

## 8. Database Design

### 8.1 Entity Relationships (from ER diagram)
- **User**: username, email, password
- **Admin**: username, email, password
- **Movie**: movieId, movieName, description, genres, releaseDate, runtime, certification, media, shows
- **Theatre**: theatreId, theatreName, location, adminName, seat layouts (lower/middle/balcony), seat prices per class
- **Show**: showId, movieId, theatreName, showdate, showtime, adminEmail, tickets
- **Booking**: bookingId, userEmail, showId, ticketsData
- **Favorite**: userEmail, movieId
- **Review**: user, movie, rating, comment
- Relationships: Movie 1—N Show · Show N—1 Theatre · User 1—N Booking · Booking N—1 Show · User N—N Movie (via Favorite)

### 8.2 Mongoose Schemas (reference)

**User** (`models/userModel.js`)
```js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 3, max: 20, unique: true },
  email:    { type: String, required: true, unique: true, max: 50 },
  password: { type: String, required: true, min: 8 },
});
module.exports = mongoose.model("User", userSchema);
```

**Admin** (`models/adminModel.js`)
```js
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 3, max: 20, unique: true },
  email:    { type: String, required: true, unique: true, max: 50 },
  password: { type: String, required: true, min: 8 },
});
module.exports = mongoose.model("Admin", adminSchema);
```

**Movie** (`models/movieModel.js`) — fields confirmed from source
```js
movieName:   { type: String, required: [true, "Movie name is required"], trim: true,
               minlength: [2, "..."], maxlength: [200, "..."] },
description: { type: String, required: [true, "Description is required"], trim: true,
               minlength: [10, "..."] },
genres:      { type: [String], required: [true, "At least one genre is required"],
               validate: { validator: g => Array.isArray(g) && g.length > 0,
                           message: "At least one genre is required" } },
releaseDate: { type: Date, required: [true, "Release date is required"],
               validate: { validator: d => d instanceof Date && !isNaN(d),
                           message: "Invalid release date" } },
// Not visible in the source screenshot but present in the ER diagram — add these:
// movieId (String), runtime (Number), certification (String), media (array of {url} or strings)
```

**Theatre** (`models/theatreModel.js`)
```js
theatreName:       { type: String, required: true },
theatreId:         { type: String, required: true },
location:          { type: String, required: true },
balconySeatPrice:  { type: Number, required: true },
middleSeatPrice:   { type: Number, required: true },
lowerSeatPrice:    { type: Number, required: true },
balconySeats:      { type: Object, required: true },
middleSeats:       { type: Object, required: true },
lowerSeats:        { type: Object, required: true },
// ER diagram also shows adminName
```

**Show** (`models/showModel.js`)
```js
adminEmail: { type: String, required: true },   // show created by admin
showId:     { type: String, required: true },
movieId:    { type: String, required: true },
theatreName:{ type: String, required: true },
showdate:   { type: String, required: true },   // "YYYY-MM-DD"
showtime:   { type: String, required: true },   // "HH:mm" 24h
tickets:    { type: Object },                   // seat availability map
// module.exports = mongoose.model("show", showSchema);
```

**Booking** (`models/bookingModel.js`)
```js
bookingId:   { type: String, required: true },
userEmail:   { type: String, required: true },
showId:      { type: String, required: true },
ticketsData: { type: Object, required: true },  // NOTE: source had typo `requires`; use `required`
// module.exports = mongoose.model("Booking", bookingSchema);
```

**Favorite** — `userEmail`, `movieId`
**Review** — user reference, movie reference, rating (1–5), comment, createdAt

### 8.3 Database Connection
```js
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)   // e.g. mongodb://127.0.0.1:27017/Imovies
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
```
- Database name: `Imovies` (auto-created on first insert)
- Default MongoDB port: `27017`
- Modern Mongoose does not need `useNewUrlParser` / `useUnifiedTopology`
- Ensure the DB is connected before handling requests

---

## 9. Backend Specification

### 9.1 `server.js` Setup (reference)
```js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config({ path: "./.env" });

// Prefer IPv4 DNS results (avoids ::1 issues with some providers)
const dns = require("dns");
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder("ipv4first");

const { verifyTransport } = require("./utils/mailer");
const { sendReminderEmails } = require("./utils/reminderService");
const { cleanupOldBookings } = require("./utils/cleanupService");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",       authRoutes);
app.use("/api/shows",      showRoutes);
app.use("/api/theatre",    theatreRoutes);
app.use("/api/movie",      movieRoutes);
app.use("/api/favorite",   favoriteRoutes);
app.use("/api/bookings",   bookingRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/review",     reviewRoutes);   // reviewRoutes is imported in source

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
```
Also: schedule `sendReminderEmails` and `cleanupOldBookings` with `node-cron`; call `verifyTransport()` on startup.

### 9.2 API Route Map

| Base path | Router | Purpose |
|---|---|---|
| `/api/auth` | authRoutes | User register, login, logout |
| `/api/auth/admin` | adminRoutes | Admin register, login |
| `/api/movie` | movieRoutes | Movie CRUD, list, search/filter |
| `/api/theatre` | theatreRoutes | Theatre CRUD |
| `/api/shows` | showRoutes | Show CRUD, `GET /getmovieshows/:movieName` |
| `/api/bookings` | bookingRoutes | Create booking, history, cancel, admin list |
| `/api/favorite` | favoriteRoutes | Add/remove/list favorites |
| `/api/review` | reviewRoutes | Add/list/moderate reviews |

*Exact sub-routes are not specified in the source; design them RESTfully and document each one as you build it.*

### 9.3 Required Capabilities
- **Auth:** registration, login, logout; password hashing with bcrypt; JWT issued on login
- **Middleware (`fetchUser.js`):** verify JWT, attach user/role to `req`, block unauthorized access
- **Role-based access:** `User` vs `Admin` protected routes
- **CRUD:** full Create/Read/Update/Delete for movies, theatres, shows, bookings
- **Validation:** server-side input validation on all write endpoints
- **Error handling:** central error middleware returning consistent JSON `{ success, message }` with proper status codes
- **Rate limiting:** `express-rate-limit` on API routes
- **Logging:** request and error logging
- **Pagination:** movie listings and booking logs
- **Background jobs (`node-cron`):** booking reminder emails; cleanup of old bookings

### 9.4 Dependencies (server)
`express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `multer`, `socket.io` (optional), `node-cron`, `nodemailer`, `express-rate-limit`; dev: `nodemon`

### 9.5 Environment Variables (`server/.env`)
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/Imovies
JWT_SECRET=change_me
# Email (for utils/mailer.js)
EMAIL_USER=
EMAIL_PASS=
# Payment gateway keys (Razorpay by default)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```
Commit a `.env.example` with the same keys and empty values; keep `.env` in `.gitignore`.

---

## 10. Frontend Specification

### 10.1 Dependencies (client)
From the reference `package.json`: `react@18`, `react-dom@18`, `react-router-dom@6`, `axios`, `js-cookie`, `jwt-decode`, `react-toastify`, `react-icons`, `react-loader-spinner`, `dayjs`, `moment`, `sass`, `swr`, `uuid`, `framer-motion`, `chart.js` + `react-chartjs-2` (admin charts), `react-slick` + `slick-carousel` (carousels), `@fortawesome/*` (icons), `firebase` (optional; e.g. image storage)
Plus: `bootstrap`
Scripts: `dev` (vite), `build`, `lint`, `preview`

### 10.2 Routing (`App.jsx`)
All pages lazy-loaded with `React.lazy` inside `<Suspense fallback={<Loader/>}>`, wrapped in `<BrowserRouter>`. Import `react-toastify/dist/ReactToastify.css` once.

| Access | Pages |
|---|---|
| **Public** | Landing `/`, Login, Register, AdminLogin, AdminRegister |
| **User-protected** (`UserProtection`) | Home, MovieDetails, MovieShows, SeatsPage, Bookings, FavoriteShows, Profile, EditUserDetails |
| **Admin-protected** (`AdminProtection`) | Admin dashboard, AddMovie, AddShow, AddTheatre, AdminBookings |

### 10.3 Key UI Components & Pages
- **Header / Footer / Loader** shared components; header adapts by role
- **Landing, Login, Register** pages
- **Home** — movie listing with search + filters (genre, language, rating, theatre, location, date)
- **MovieDetails** — details, reviews, favorite toggle, "view shows"
- **MovieShows** — fetches `/api/shows/getmovieshows/${movieName}` via `useFetch`; sorts by date+time; converts 24h → 12h format
- **SeatsPage** — seat layout (balcony / middle / lower), live availability, total price
- **Bookings** — upcoming and past bookings, cancel
- **FavoriteShows**, **Profile**, **EditUserDetails**
- **Admin dashboard** — movies list with details popup (`MovieDetailsPopup`: handles `media` as string, array, or `{url}`; falls back to `/default-movie.png`), charts, management links
- **AddMovie / AddShow / AddTheatre / AdminBookings**
- Toast notifications (`react-toastify`), fully responsive layout

> Visual and interaction design for every page below is defined in **Section 10A**.

### 10.4 Frontend Logic Conventions
- Axios for all API calls; API base URL exported from `src/host.js` as `render`
- Hooks: `useState` (forms/data), `useEffect` (load data), `useContext` (auth/global state), custom `useFetch(url)` returning `{ resData, loading, error }`
- JWT stored via `js-cookie`; decode with `jwt-decode` to read role
- Show/hide features by role; guard routes with `UserProtection` / `AdminProtection`
- One `style.scss` per page folder

---

## 10A. UI/UX Design System (added)

> **Priority:** This section defines how IMovies *looks and feels*. It works **within** the Section 2 decision (Bootstrap + SCSS): Bootstrap provides the grid, utilities and form behaviour, but it is **re-themed with the tokens below**. The default Bootstrap look (blue buttons, white cards, grey navbar) must not ship.

### 10A.1 Design concept: "House lights"
IMovies behaves like the theatre itself.

- **Browsing is the lobby:** warm, lit, poster-led. Posters are the main visual content on every screen.
- **Booking is the auditorium:** when the person opens the seat map, the interface dims and the screen glows, so seat choice feels like sitting down.
- **The memorable element is the seat map** (Section 10A.5). Spend visual effort there. Everything else stays calm and quiet so the posters and seats stand out.

Audience: phone-first young adults in India booking tickets in a hurry, plus admins working at a desk. Primary job of the UI: get from "what's on?" to "paid" in as few steps and as little thinking as possible.

### 10A.2 Design tokens

**Colour** (dark theme is the default; set `data-bs-theme="dark"` on `<html>`)

| Token | Hex | Use |
|---|---|---|
| `--im-auditorium` | `#1B0F24` | Page background |
| `--im-velvet` | `#2A1535` | Cards, panels, inputs (raised surface) |
| `--im-velvet-hi` | `#3A2048` | Hover/selected surface, table header |
| `--im-curtain` | `#7A1F3D` | Hero bands, auth side panel, badges |
| `--im-marquee` | `#F6B73C` | Primary buttons, selected seats, focus ring, active tab |
| `--im-silver` | `#ECE8F2` | Primary text; also the paper colour of the e-ticket |
| `--im-dusk` | `#A79DB8` | Secondary text, borders at 30% opacity |
| `--im-success` | `#4CC9A0` | Confirmed, available-fast indicators |
| `--im-danger` | `#FF6B6B` | Errors, cancel, payment failed |

- Text on `--im-marquee` buttons is `--im-auditorium` (contrast above 10:1).
- Body text contrast must be at least 4.5:1 on its surface. `--im-dusk` on `--im-velvet` is about 6:1, so it is allowed for secondary text but not below 14px.
- Never use colour as the only signal (see seat states).

**Typography** (self-hosted with `@fontsource-variable/*`, `font-display: swap`)

| Role | Family | Notes |
|---|---|---|
| Display (page titles, movie titles, hero) | **Bricolage Grotesque** | Weight 700–800, tight line-height (1.1), slightly negative letter-spacing |
| Body, UI, forms, tables | **Figtree** | Weight 400/500/600, line-height 1.55 |

- Scale: 12 / 14 / 16 (body) / 20 / 28 / 40 / 64 px. Hero and page titles use `clamp()`.
- Sentence case everywhere. **No all-caps labels, no tracked-out eyebrow text above headings.**
- Keep text blocks under about 65 characters wide. Left-align all text; centre only short empty-state messages.

**Spacing, radius, elevation**

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 72 px. Page container: `max-width: 1200px`, 16px side padding on mobile, 32px on desktop.
- **Radius depends on hierarchy, not one value for everything:** 6px for seats, chips and inputs; 12px for cards and modals; 20px for hero panels and the e-ticket.
- **Elevation comes from surface lightness plus a 1px border** (`rgba(236,232,242,.08)`), not stacked grey drop shadows. The only glow in the app is `--im-marquee` at low opacity on primary actions and selected seats.
- No gradient washes as decoration. The only gradients allowed: the poster-to-background fade on MovieDetails, and the screen glow on SeatsPage.

**Token and Bootstrap wiring** (`client/src/styles/_tokens.scss`, imported once in `main.jsx`)

```scss
// 1) Override Bootstrap variables BEFORE importing Bootstrap
$primary: #F6B73C;
$body-bg: #1B0F24;
$body-color: #ECE8F2;
$font-family-sans-serif: "Figtree Variable", system-ui, sans-serif;
$headings-font-family: "Bricolage Grotesque Variable", system-ui, sans-serif;
$border-radius: 6px;
$border-radius-lg: 12px;
$btn-color: #1B0F24;
$input-bg: #2A1535;
$input-border-color: rgba(167, 157, 184, .3);
$input-focus-border-color: #F6B73C;

@import "bootstrap/scss/bootstrap";

// 2) Expose tokens as CSS variables for page-level style.scss files
:root {
  --im-auditorium: #1B0F24;  --im-velvet: #2A1535;  --im-velvet-hi: #3A2048;
  --im-curtain: #7A1F3D;     --im-marquee: #F6B73C; --im-silver: #ECE8F2;
  --im-dusk: #A79DB8;        --im-success: #4CC9A0; --im-danger: #FF6B6B;
  --im-line: rgba(236, 232, 242, .08);
}
:focus-visible { outline: 2px solid var(--im-marquee); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

### 10A.3 Shared components

| Component | Specification |
|---|---|
| **Header** | Sticky. Logo left; Home, Favourites, Bookings links; profile menu right. Collapses to a bottom tab bar (Home, Favourites, Bookings, Profile) under 768px. Admin header shows a sidebar instead (see 10A.7). Active link: Marquee underline, not a filled pill. |
| **MovieCard** | Poster at fixed 2:3 aspect ratio (`aspect-ratio`, no layout shift), title (display font, 2-line clamp), then one plain meta line: certification, runtime, language. Heart button top-right of the poster toggles favourite with an optimistic update. The whole card is one link; the heart is a separate button. |
| **FilterBar** | Sticky under the header. Search input plus filter chips for genre, language, rating, theatre, location and a 7-day date strip. Chips open a dropdown (desktop) or bottom sheet (mobile). Active filters show as removable chips with a "Clear all" button. |
| **ShowtimeChip** | 12-hour time ("7:30 pm"), price-from underneath. Past shows are disabled. A show with under 20% of seats left shows the text "Filling fast". |
| **SeatMap** | See 10A.5. Reused read-only in the admin AddTheatre preview. |
| **BookingSummary** | Movie, theatre, date and time, chosen seats grouped by tier, total. Sticky side panel on desktop, bottom sheet on mobile. |
| **TicketCard** | See 10A.6. Compact variant for the bookings list, full variant for confirmation. |
| **Skeleton** | CSS-only shimmer placeholders (`Loader.jsx` exports `PosterSkeleton`, `RowSkeleton`, `PageLoader`). Replace spinners everywhere except button loading states. |
| **EmptyState** | Short title, one sentence on what to do next, one primary action. Example: "No upcoming shows" / "Find a movie and pick your seats." / **Browse movies**. |
| **Toast** (`react-toastify`) | Dark theme, bottom-centre on mobile and top-right on desktop. Use the same verb as the button: "Pay ₹750" leads to "Payment received". |
| **ConfirmDialog** | For destructive actions. Title states the consequence, buttons name the outcome ("Cancel booking" and "Keep booking"), never "OK/Cancel". |
| **Forms** | Labels always visible above fields. Inline validation on blur. Password show/hide toggle. Submit button shows a spinner and disables while loading. Server errors appear next to the field they belong to. |

### 10A.4 Page-by-page UI

**Landing** (`/`)
```
┌──────────────────────────────────────────────┐
│ IMovies                       Log in  Sign up │
│                                              │
│  Movie ticket booking          ┌──┐┌──┐┌──┐  │
│  made simple.                  │  ││  ││  │→ │  poster rail,
│  [ Browse movies ]             └──┘└──┘└──┘  │  scroll-snap
│                                              │
│  Now showing   ─────────────────────────────  │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                    │
│  How booking works: 1 Choose  2 Pick  3 Pay  │
└──────────────────────────────────────────────┘
```
- The hero leads with real posters from the API (fallback: `/default-movie.png`), not a stats row or gradient.
- "How booking works" is a true sequence, so numbered steps are appropriate here.

**Login / Register / AdminLogin / AdminRegister**
- Two-column layout on desktop: left panel in `--im-curtain` with a poster collage and one line of copy, right panel with the form. On mobile only the form shows.
- Admin pages use the same layout with a small "Admin" badge in the header of the form so users cannot confuse them.

**Home**
```
[ Search movies...            ]
[Genre ▾][Language ▾][Rating ▾][Theatre ▾][Location ▾]
[Today][Wed 21][Thu 22][Fri 23][Sat 24][Sun 25][Mon 26]
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│  │ │  │ │  │ │  │ │  │ │  │   2 columns on phones,
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘   up to 6 on wide screens
 Title  Title ...
[ Load more ]
```
- Pagination: "Load more" button (spec requires pagination). Show 12 skeleton cards while loading.
- Zero results: EmptyState with "Clear all filters".

**MovieDetails**
- Top: blurred, darkened poster as backdrop fading into `--im-auditorium`. Poster left, then title, one meta line (certification, runtime, release year, genres), description, and the buttons **View shows** (primary) and a heart toggle labelled "Add to favourites".
- Below: tabs **About** (cast row, media) and **Reviews** (average rating, star input form for logged-in users, review list with date).

**MovieShows**
- Date strip at the top (next 7 days). Below it, shows grouped by theatre: name and location on the left, ShowtimeChips on the right (wrap on mobile).
- Empty day: "No shows on this date. Try another day." with the date strip still visible.

**SeatsPage:** see 10A.5.

**Payment and confirmation:** see 10A.6.

**Bookings**
- Tabs: **Upcoming** and **Past**. Each booking is a compact TicketCard. Cancel opens ConfirmDialog. Cancelled bookings show a muted "Cancelled" status badge and keep their ticket details.

**FavoriteShows / Profile / EditUserDetails**
- Favourites reuse the MovieCard grid. Profile is a single column with account details and links to Edit, Bookings, Favourites, and Log out. Edit form follows the shared Forms rules.

### 10A.5 SeatsPage: the memorable moment
```
              ╭──────── screen ────────╮      ← curved arc, soft amber glow
 Balcony  A   ◯ ◯ ◯ ◯   ◯ ◯ ◯ ◯ ◯ ◯   ◯ ◯ ◯ ◯
          B   ...                                 ₹ price chip per tier
 Middle   C   ...
 Lower    F   ...                      ┌ Summary ┐
                                        │ seats   │
 ◯ Available  ● Selected  ▨ Booked      │ ₹750    │
                                        │ [Pay ₹750]
                                        └─────────┘
```

- **Entry moment (the one orchestrated animation):** on mount, the page background eases from the lobby tone to `--im-auditorium` over about 600ms and the screen arc fades in with its glow. Rows nearest the screen are very slightly brighter than rows at the back. After that, nothing moves on its own.
- **Seat states** (distinguishable without colour):

| State | Look | Behaviour |
|---|---|---|
| Available | Outline in `--im-dusk` | Selectable |
| Selected | Filled `--im-marquee` with a check icon | Click again to deselect |
| Booked | Dim fill with diagonal hatch pattern | `aria-disabled`, not selectable |
| Held by someone else *(only if Socket.io is built)* | Dashed amber outline | Not selectable, clears when the hold expires |

- **Tiers:** Balcony, Middle, Lower each get a labelled band on the left with the price shown once per tier, with rows labelled by letter and seats numbered. Aisle gaps are real gaps in the grid.
- **Sizing:** 28px seats with 6px gaps on desktop. On phones, seats stay 32px visible but each has a 44px tap target; the map scrolls horizontally with zoom in/out buttons, and the screen arc stays pinned at the top.
- **Limits:** maximum 8 seats per booking (assumption, changeable). Trying to select a ninth shows a toast "You can book up to 8 seats."
- **Summary:** updates live. The CTA reads "Pay ₹{total}" and is disabled until at least one seat is selected. If Socket.io holds are built, show a hold countdown ("Seats held for 4:59") in the summary.
- **Accessibility:** the map is `role="grid"`. Arrow keys move between seats, Space or Enter toggles. Each seat has an `aria-label` like "Row C, seat 7, Middle, ₹250, available". An `aria-live="polite"` region announces "3 seats selected, total ₹750".

### 10A.6 Payment, confirmation and e-ticket
- **Payment** opens the gateway from the Summary. While waiting, the CTA shows a spinner and the seat map is non-interactive.
- **Failure:** inline panel (not just a toast): "Payment didn't go through" + reason if the gateway gave one + buttons **Try again** and **Use another method**. State that the seats are still held (only if holds exist), otherwise that they may be released.
- **Success:** the full TicketCard appears once with a short slide-in (this answers the person's action, so motion is appropriate). Toast: "Payment received".
- **E-ticket design:** light paper surface (`--im-silver`) with `--im-auditorium` text, 20px radius, a perforated divider (CSS radial-gradient mask) between movie details and the seat block. Contents: movie title, theatre, date, 12-hour time, seats, booking ID, QR code (optional dependency `qrcode.react`). Buttons: **Download ticket** (print stylesheet or PDF) and **View my bookings**.

### 10A.7 Admin UI
- **Layout:** left sidebar (Dashboard, Movies, Theatres, Shows, Bookings) on desktop, becoming a scrollable top tab bar on mobile. Same tokens as the user app, denser (14px base text, tighter row height).
- **Dashboard:** four summary tiles (today's bookings, this month's revenue, upcoming shows, seats sold this week), a revenue chart and a bookings-per-movie chart (`chart.js`, themed to the palette and lazy-loaded), then a movies table with search and the `MovieDetailsPopup` modal.
- **AddMovie:** two columns, form left and a **live poster preview** right (uses the same MovieCard component).
- **AddTheatre:** inputs for rows and seats per tier plus prices, with a **live read-only SeatMap preview** that updates as the numbers change.
- **AddShow:** pick movie, then theatre, then date and time. Warn before saving if the theatre already has a show overlapping that slot.
- **AdminBookings:** data table with filters (date, movie, status), status badges (Confirmed, Cancelled, Payment failed) and pagination. Tables scroll horizontally inside their own container on small screens.

### 10A.8 Motion rules
1. Only one unprompted animation exists: the SeatsPage entry moment.
2. Motion that responds to an action is allowed and should show what changed: seat toggle (80–120ms), favourite heart, ticket slide-in, dialog open, toast.
3. No scroll-triggered fade-ups on sections, no hover lifts on every card.
4. Use `framer-motion` (already in the dependency list). Respect `prefers-reduced-motion` (the global rule in 10A.2 plus disabling framer transitions when it is set).
5. Durations 80–250ms for interactions, ease-out. Nothing over 600ms.

### 10A.9 Microcopy rules
- Sentence case, plain verbs, active voice. Name actions by outcome: "Book seats", "Pay ₹750", "Save changes".
- Keep the same word through a flow: button "Cancel booking", dialog "Cancel this booking?", toast "Booking cancelled".
- Currency is ₹ with Indian digit grouping (`toLocaleString("en-IN")`). Times are 12-hour with lowercase am/pm.
- Errors say what happened and what to do next, with no apology and no vague wording. Example: "That email is already registered. Log in instead."
- Empty states always give a next action.

### 10A.10 Responsive and performance rules
- Breakpoints: 576 / 768 / 992 / 1200 (Bootstrap defaults). Design phone-first.
- Posters: `loading="lazy"`, fixed aspect ratio, `onError` fallback to `/default-movie.png`.
- Fonts self-hosted, only the weights listed. Admin chart code is lazy-loaded so it never loads for users.
- Target: Lighthouse accessibility 90+ and no layout shift on the Home grid.

### 10A.11 UI dependency changes
- Add: `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/figtree`. Optional: `qrcode.react`.
- Drop to avoid duplicates: `moment` (keep `dayjs`), `@fortawesome/*` (keep `react-icons`), `react-loader-spinner` (replaced by Skeleton components).
- Keep: `bootstrap`, `sass`, `framer-motion`, `react-toastify`, `chart.js` + `react-chartjs-2`, `react-slick` (optional, only if the poster rail is not built with CSS scroll-snap, which is preferred).

---

## 11. Security Checklist
- [ ] Passwords hashed with bcrypt.js
- [ ] JWT verified in middleware for every protected API
- [ ] Separate User and Admin role checks
- [ ] Input validation and sanitization on server
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Secrets only in `.env`
- [ ] No unauthorized access to other users' bookings

---

## 12. Testing & Validation Checklist
- [ ] Register / login / logout (user and admin)
- [ ] Movie, theatre, show, booking CRUD APIs (Postman)
- [ ] Search and filter logic
- [ ] Seat availability and **double-booking prevention**
- [ ] Payment success and failure handling
- [ ] Booking cancellation
- [ ] Responsive UI and navigation
- [ ] Error-free data handling
- [ ] UI matches Section 10A tokens (no default Bootstrap look)
- [ ] Seat map usable by keyboard and screen reader; seat states distinguishable without colour
- [ ] Loading skeletons, empty states and error states exist on every data-driven page
- [ ] Layout checked at 360px, 768px and 1280px widths
- [ ] Reduced-motion setting disables animations

---

## 13. Monitoring & Optimization
- MongoDB **indexes** for: movie search, show filtering, booking history, seat availability
- Centralized error handling and logging
- Express rate limiting
- Pagination for movies and bookings
- Refactor into services / models / controllers for scalability

---

## 14. Build Order (follow step by step)

| Step | Task | Output |
|---|---|---|
| 1 | Create root folder with `client/` and `server/` | Folder skeleton |
| 2 | **Server setup:** `npm init -y`, install deps, `server.js`, `.env`, DB connection, CORS, JSON parsing | Server runs, DB connects |
| 3 | **Models:** User, Admin, Movie, Theatre, Show, Booking, Favorite, Review | `models/` complete |
| 4 | **Auth:** register/login/logout for user and admin, bcrypt, JWT, `fetchUser.js` middleware | Auth works in Postman |
| 5 | **Movie, Theatre, Show APIs** (admin-protected writes) | CRUD works |
| 6 | **Booking + seat logic** with availability checks, cancel, history | No double-booking |
| 7 | **Favorites + Reviews APIs** | Endpoints done |
| 8 | **Payments + Notifications** (gateway service, mailer, cron reminders/cleanup) | Pay → confirm → email |
| 9 | **Error handling, validation, rate limiting, pagination, indexes** | Hardened API |
| 10 | **Client setup:** `npm create vite@latest . -- --template react`, install deps, router, `host.js`, `useFetch`, protection components. **Design foundation:** `styles/_tokens.scss` (Section 10A.2), fonts, Header/Footer, Loader skeletons, EmptyState, ConfirmDialog, toast theme | Frontend skeleton that already looks like IMovies |
| 11 | **Public + auth pages:** Landing (poster rail), Login, Register (Section 10A.4) | Users can sign in |
| 12 | **User pages:** Home (FilterBar + MovieCard grid), MovieDetails, MovieShows, **SeatsPage (SeatMap, BookingSummary, entry moment)**, payment + TicketCard confirmation, Bookings, Favorites, Profile | Full booking flow |
| 13 | **Admin pages** with AdminLayout sidebar: Dashboard (themed charts), AddMovie (live preview), AddTheatre (live seat preview), AddShow, AdminBookings | Admin management |
| 14 | **UI polish pass against Section 10A:** accessibility (keyboard seat map, focus rings, contrast), responsive checks, motion rules, microcopy review, Lighthouse | Production-ready UI |
| 15 | **(Optional)** Socket.io real-time seat locking with TTL | Live seat updates |
| 16 | **Test** with Section 12 checklist, then deploy (Section 5.6) | Live app |

---

## 15. Run Instructions

```bash
# Frontend
cd client
npm install
npm run dev            # http://localhost:5173

# Backend (new terminal)
cd server
npm install
# create .env (Section 9.5)
nodemon server.js      # http://localhost:3000  (or PORT from .env)
```

---

## 16. Final Screens Expected (for visual reference)
Landing page · Register · Login · Admin Dashboard · Admin Add Movie · Add Show · Add Theatre · User movie browsing · User bookings

Additional screens to produce for the redesign: Movie details · Show times · **Seat selection (dimmed auditorium with screen glow)** · Payment failed state · E-ticket confirmation · Empty states · Mobile views of Home and Seat selection

---

## 17. Known Gaps in the Source (AI: fill these in sensibly and tell me what you chose)
- Controllers folder contents and exact endpoint paths are not defined
- Payment, Seat, and Notification collections appear in the written spec but have no schema in the screenshots
- Movie schema screenshot was cut off after `releaseDate` (ER diagram supplies the remaining fields)
- Mentor, demo link, and GitHub link: **not yet provided**
