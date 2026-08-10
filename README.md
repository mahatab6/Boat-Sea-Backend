# 🚢 Boat Sea — Backend API

A production-grade, multi-tenant boat booking REST API powering the **Boat Sea** platform. Built with **Node.js**, **Express v5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** — featuring Stripe payments, AI-powered search (RAG), Google OAuth, and serverless deployment on Vercel.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.5-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## 🔭 Overview

Boat Sea is a SaaS platform that connects **boat owners/operators** with **customers** looking to book boat trips. The backend serves **59+ REST API endpoints** across **13 feature modules**, supporting four user roles with granular access control.

### User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse boats, book trips, pay via Stripe, manage bookings, leave reviews, receive notifications |
| **Boat Owner** | Register boats, manage schedules & routes, view booking requests, track earnings |
| **Admin** | Manage all users/boats/routes, view platform-wide stats, manage knowledge base |
| **Super Admin** | Full platform control with elevated admin privileges |

---

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────────────────────────────────────────────┐
│   Frontend   │────▶│                   Express v5 API                    │
│  (Next.js)   │◀────│                                                      │
└─────────────┘     │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │
                    │  │  Auth   │  │ Middleware│  │   Route Handler   │   │
                    │  │(Better  │  │  (RBAC,  │  │  (13 Modules)     │   │
                    │  │ Auth +  │  │  Zod,    │  │                   │   │
                    │  │  JWT)   │  │  Multer) │  │                   │   │
                    │  └─────────┘  └──────────┘  └───────────────────┘   │
                    │                      │                               │
                    │         ┌─────────────┼─────────────┐               │
                    │         ▼             ▼             ▼               │
                    │  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
                    │  │  Prisma   │ │ Cloudinary│ │  Stripe   │         │
                    │  │  (ORM)    │ │ (Storage) │ │(Payments) │         │
                    │  └─────┬─────┘ └───────────┘ └─────┬─────┘         │
                    │        │                           │               │
                    │        ▼                           ▼               │
                    │  ┌───────────┐              ┌───────────┐          │
                    │  │PostgreSQL │              │  Webhook   │          │
                    │  │+ pgvector │              │  Handler   │          │
                    │  └───────────┘              └─────┬─────┘          │
                    │                                   │               │
                    │                    ┌──────────────┼──────────┐    │
                    │                    ▼              ▼          ▼    │
                    │              ┌──────────┐  ┌──────────┐ ┌──────┐ │
                    │              │ PDFKit   │  │Nodemailer│ │ RAG  │ │
                    │              │(Invoice) │  │ (Email)  │ │(AI)  │ │
                    │              └──────────┘  └──────────┘ └──────┘ │
                    └──────────────────────────────────────────────────┘
```

### Design Patterns

- **Modular MVC** — Each feature module has its own `controller`, `service`, `route`, `validation`, `constant`, and `interface` files
- **Service Layer** — Business logic isolated from HTTP concerns
- **Repository Pattern** — Prisma client abstracted through services
- **Generic QueryBuilder** — Reusable class with chainable search, filter, sort, paginate, field selection, nested relation filtering, and range queries
- **Centralized Error Handling** — Custom `AppErrors` class with HTTP status codes
- **Async Wrapper** — `catchAsync` higher-order function for clean error propagation

---

## 🛠 Tech Stack

### Core

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ | Runtime |
| **Express.js** | 5.x | HTTP framework |
| **TypeScript** | 5.9 | Type safety |
| **Prisma ORM** | 7.5 | Database ORM with multi-schema folder, driver adapters |
| **PostgreSQL** | — | Primary database |

### Authentication & Security

| Technology | Purpose |
|-----------|---------|
| **Better Auth** | Session-based auth, Google OAuth 2.0, email OTP verification |
| **JSON Web Tokens** | Access + refresh token rotation |
| **Cookie-based Sessions** | Secure, httpOnly, sameSite=none cookies |
| **Zod v4** | Request body/query/params validation |
| **RBAC Middleware** | Role-based route protection (4 roles) |

### Integrations

| Technology | Purpose |
|-----------|---------|
| **Stripe** | Checkout Sessions, webhook event handling, payment processing |
| **Cloudinary** | Image & PDF upload/storage/deletion |
| **Nodemailer** | SMTP transactional emails |
| **EJS** | Email templates (OTP, booking confirmation, password reset) |
| **PDFKit** | A4 invoice PDF generation |
| **Multer** | File upload middleware (Cloudinary storage engine) |

### AI / RAG Pipeline

| Technology | Purpose |
|-----------|---------|
| **pgvector** | 2048-dimension vector embeddings storage |
| **OpenRouter API** | LLM responses (`nvidia/nemotron-3-super-120b`) |
| **OpenRouter API** | Embeddings (`nvidia/llama-nemotron-embed-vl-1b-v2`) |

### DevOps & Deployment

| Technology | Purpose |
|-----------|---------|
| **Vercel** | Serverless deployment |
| **tsup** | ESM bundling (target: Node 20) |
| **@prisma/adapter-pg** | Prisma driver adapter for Vercel edge compatibility |
| **@vercel/functions** | `waitUntil` for non-blocking background tasks |

---

## ✨ Features

### 🔐 Authentication & Authorization
- Dual auth system: **Better Auth** (sessions, OAuth) + **Custom JWT** (access/refresh tokens)
- Google OAuth 2.0 with `oAuthProxy` plugin
- Email OTP verification (6-digit, 5-min expiry)
- Password reset flow with tokenized email links
- Refresh token rotation with secure cookie storage
- Session lifecycle management with auto-refresh (X-Session-Refresh header)
- Role-based access control across all protected routes

### 🚤 Boat Management
- Full CRUD for boats with multi-field validation
- Multi-image upload via Cloudinary (auto-named, organized by folder)
- Featured boats endpoint (top 6 by rating)
- Owner-scoped boat listing
- Cascading cleanup (Cloudinary images deleted on boat removal)
- Booking guard — prevents deletion of boats with active CONFIRMED bookings

### 📅 Schedule & Route Management
- Route CRUD with difficulty levels (EASY, MODERATE, HARD) and scenic highlights
- Schedule creation with **recurring pattern generation** — DAILY, WEEKLY, or MONTHLY from start to end date via `createMany`
- Available route lookup (UPCOMING schedules for today)
- Owner-scoped schedule management

### 📋 Booking System
- Booking creation with capacity validation and unique booking reference (`BT-xxxxxxx`)
- Integrated Stripe Checkout Session creation during booking flow
- Booking cancellation with state machine transitions (PENDING → CANCELLED)
- Customer, operator, and admin scoped booking queries
- Passenger details stored as JSON

### 💳 Stripe Payment Integration
- **Checkout Session** creation with product metadata
- **Webhook handler** with signature verification (`stripe.webhooks.constructEvent`)
- **Idempotency** via unique `stripeEventId` constraint
- **Post-payment orchestration** (all inside `prisma.$transaction`):
  - Booking status → CONFIRMED
  - Schedule status → COMPLETED
  - Boat status → UNAVAILABLE
  - Payment record updated with `transactionId`, `paymentMethod`, `paidAt`
  - PDF invoice generated → uploaded to Cloudinary
  - Confirmation email with PDF attachment sent via Nodemailer
- Failed/expired session handling (Payment → FAILED)

### 🤖 AI-Powered Search (RAG Pipeline)
- **Embedding generation** using OpenRouter API (nvidia/llama-nemotron-embed-vl-1b-v2, 2048 dimensions)
- **Vector similarity search** via pgvector (`DocumentEmbedding` model with `Unsupported("vector(2048)")`)
- **LLM-powered Q&A** using OpenRouter (nvidia/nemotron-3-super-120b)
- **Multi-source indexing**: boats, reviews, owners, routes, schedules
- Admin-controlled reindexing and soft-delete of embeddings
- Public-facing `/ask` and `/search` endpoints

### ⭐ Review System
- Post-booking reviews with 1–5 star rating
- **Automatic boat rating recalculation** (average rating + totalReviews) via transactions
- Verified review filtering
- Review image support

### 📊 Role-Based Dashboard Analytics
- **Admin/Super Admin**: total bookings, boats, users, revenue; pie chart (booking status distribution), bar chart (monthly revenue), line chart (payment amounts over time)
- **Boat Owner**: total bookings for owned boats, boat count, total earnings; pie chart, bar chart (monthly bookings via raw SQL), area chart
- **Customer**: total bookings, active trips (CONFIRMED with future date), total spent; pie chart, bar chart (monthly bookings via raw SQL)
- All stats use `Promise.all` for parallel database aggregation

### 📧 Email System
- SMTP via Nodemailer with configurable host/port/auth
- EJS-templated emails:
  - **OTP verification** — 6-digit code
  - **Booking confirmation** — with PDF invoice attachment
  - **Password reset** — tokenized link
  - **Google OAuth redirect** — redirect page template
- Non-blocking sends via `@vercel/functions` `waitUntil`

### 🔔 Notifications
- In-app notification creation on key events
- Per-user notification listing (ordered by latest)
- Mark single / mark all as read

### 🎫 Ticket System
- Ticket generation linked to bookings and seats
- Unique ticket numbers with QR code support
- Scan tracking (isScanned, scannedAt, scannedBy)

---

## 📁 Project Structure

```
boat-backend/
├── api/                          # Vercel serverless entry point (built output)
├── prisma/
│   ├── migrations/               # Database migrations
│   └── schema/                   # Multi-file Prisma schema
│       ├── schema.prisma         # Generator & datasource config
│       ├── auth.prisma           # User, Session, Account, Verification
│       ├── boat.prisma           # Boat model
│       ├── boat_images.prisma    # Boat images
│       ├── bookings.prisma       # Booking model
│       ├── enums.prisma          # All enums (12 total)
│       ├── license.prisma        # Operator license/verification
│       ├── notification.prisma   # User notifications
│       ├── payment.prisma        # Stripe payment records
│       ├── rag.prisma            # DocumentEmbedding (pgvector)
│       ├── review.prisma         # Boat reviews
│       ├── route.prisma          # Trip routes
│       ├── schedule.prisma       # Boat schedules
│       ├── seat.prisma           # Booking seats
│       └── ticket.prisma         # Booking tickets
├── src/
│   ├── app/
│   │   ├── errorHandler/
│   │   │   └── AppErrors.ts      # Custom error class
│   │   ├── interface/
│   │   │   ├── index.d.ts        # Express Request augmentation
│   │   │   ├── query.interface.ts # QueryBuilder interfaces
│   │   │   └── requestUser.interface.ts
│   │   ├── lib/
│   │   │   ├── auth.ts           # Better Auth configuration
│   │   │   └── prisma.ts         # Prisma client (with pg driver adapter)
│   │   ├── middleware/
│   │   │   ├── ckeckAuth.ts      # RBAC middleware (session + JWT)
│   │   │   └── validateRequest.ts # Zod validation middleware
│   │   ├── module/
│   │   │   ├── auth/             # Register, login, OAuth, OTP, password reset
│   │   │   ├── boat/             # Boat CRUD, featured, owner-scoped
│   │   │   ├── booking/          # Booking lifecycle + Stripe session creation
│   │   │   ├── email/            # Email service (commented, handled via utils)
│   │   │   ├── notification/     # Notification CRUD
│   │   │   ├── payment/          # Stripe webhook, invoice PDF, payment queries
│   │   │   ├── rag/              # RAG pipeline (embeddings, LLM, indexing)
│   │   │   ├── review/           # Review CRUD + rating recalculation
│   │   │   ├── route/            # Route CRUD with difficulty
│   │   │   ├── schedule/         # Schedule CRUD + recurring generation
│   │   │   ├── stats/            # Role-based dashboard analytics
│   │   │   ├── ticket/           # Ticket generation
│   │   │   └── user/             # User management, profile, notifications
│   │   ├── routes/
│   │   │   └── routes.ts         # Central route registry
│   │   ├── shared/
│   │   │   ├── catchAsync.ts     # Async error wrapper
│   │   │   ├── password.ts       # scrypt hashing + verification
│   │   │   └── sendResponse.ts   # Standardized API response
│   │   ├── templates/
│   │   │   ├── booking-confirmation.ejs
│   │   │   ├── googleRedirect.ejs
│   │   │   ├── otp.ejs
│   │   │   └── password-reset.ejs
│   │   └── utils/
│   │       ├── QueryBuilder.ts   # Generic query builder (search/filter/sort/paginate)
│   │       ├── cookie.ts         # Cookie get/set/clear utilities
│   │       ├── email.ts          # Nodemailer SMTP email sender
│   │       ├── jwt.ts            # JWT create/verify/decode
│   │       └── token.ts          # Access/refresh/session token management
│   ├── config/
│   │   ├── cloudinary.config.ts  # Cloudinary upload/delete helpers
│   │   ├── env.ts                # Environment variable loader + validation
│   │   ├── multer.config.ts      # Multer + Cloudinary storage engine
│   │   └── stripe.config.ts      # Stripe client instance
│   ├── generated/prisma/         # Auto-generated Prisma client
│   ├── types/
│   │   └── multer-storage-cloudinary.d.ts
│   ├── app.ts                    # Express app setup (CORS, middleware, routes)
│   ├── index.ts                  # Vercel entry point
│   └── server.ts                 # Local dev server
├── prisma.config.ts              # Prisma config (schema folder, migrations)
├── tsconfig.json                 # TypeScript config (ES2023, bundler resolution)
├── vercel.json                   # Vercel deployment config
└── package.json
```

---

## 🗄 Database Schema

### Models (15 total)

| Model | Description | Key Relations |
|-------|-------------|---------------|
| **User** | Platform users (4 roles) | → Sessions, Accounts, Boats, Bookings, Reviews, Notifications, Schedules |
| **Session** | Auth sessions (Better Auth managed) | → User |
| **Account** | OAuth/credential accounts | → User |
| **Verification** | Email verification tokens | — |
| **Boat** | Registered boats with specs | → User (owner), Schedules, Bookings, Reviews, License, Images |
| **Boat_Images** | Boat photo gallery | → Boat |
| **License** | Operator license & verification docs | → Boat |
| **Route** | Trip routes with difficulty/distance | → Schedules |
| **Schedule** | Departure schedules (supports recurring) | → Boat, Route, User, Bookings, Seats |
| **Booking** | Trip bookings with passenger details | → User, Schedule, Boat, Payments, Tickets, Seats |
| **Payments** | Stripe payment records | → Booking |
| **Ticket** | Issued tickets with QR + scan tracking | → Booking |
| **Seat** | Schedule seats linked to bookings | → Schedule, Booking |
| **Review** | Boat reviews (1–5 rating) | → Boat, User |
| **Notification** | In-app notifications | → User |
| **DocumentEmbedding** | RAG vector embeddings (pgvector) | — |

### Enums (12 total)

`BoatType` · `BoatStatus` · `BookingStatus` · `PaymentStatus` · `ScheduleStatus` · `UserRole` · `UserStatus` · `VerificationStatus` · `RouteDifficulty` · `RecurringPattern` · `Gender` · `TicketStatus`

---

## 🔌 API Endpoints

> Base URL: `/api/v1`
> Better Auth: `/api/auth/*`
> Stripe Webhook: `POST /webhook`

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register with email & password |
| `POST` | `/login` | Public | Login (returns access + refresh tokens) |
| `POST` | `/verify-email` | Public | Verify email with OTP |
| `POST` | `/resend-verification-email` | Public | Resend verification OTP |
| `POST` | `/refresh-token` | Public | Rotate access token |
| `POST` | `/logout` | Public | Clear session & cookies |
| `POST` | `/forgot-password` | Public | Send password reset email |
| `POST` | `/reset-password` | Public | Reset password with token |
| `GET` | `/me` | All Roles | Get authenticated user profile |
| `GET` | `/login/google` | Public | Initiate Google OAuth flow |
| `GET` | `/google/success` | Public | Google OAuth callback handler |
| `GET` | `/oauth/error` | Public | OAuth error redirect |

### Boats — `/api/v1/boats`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | List all available boats (search, filter, paginate) |
| `POST` | `/create-boat` | Boat Owner | Create boat with image upload |
| `GET` | `/my-boats` | Boat Owner | List owner's boats |
| `GET` | `/featuredBoats` | Public | Top 6 boats by rating |
| `GET` | `/:id` | Public | Get boat details |
| `PUT` | `/:id` | Boat Owner | Update boat (ownership verified) |
| `DELETE` | `/:id` | Boat Owner | Delete boat (checks active bookings) |

### Bookings — `/api/v1/booking`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Customer | Create booking + Stripe checkout session |
| `GET` | `/` | Admin | List all bookings |
| `GET` | `/my-bookings` | Customer | List user's bookings |
| `GET` | `/my-booking-requests` | Boat Owner | List bookings for owner's boats |
| `PATCH` | `/cancel/:id` | Customer | Cancel a booking |

### Payments — `/api/v1/payments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin | List all payments (search, filter, paginate) |
| `POST` | `/webhook` *(root)* | Stripe | Webhook handler (signature verified) |

### RAG / AI Search — `/api/v1/rag`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ask` | Public | Ask a question (LLM-powered answer with context) |
| `POST` | `/search` | Public | Similarity search (raw vector results) |
| `POST` | `/index/all` | Admin | Reindex all data sources |
| `POST` | `/index/:sourceType` | Admin | Index specific source (BOAT/REVIEW/OWNER/ROUTE/SCHEDULE) |
| `DELETE` | `/index/:sourceType/:sourceId` | Admin | Remove embeddings by source |

### Reviews — `/api/v1/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Customer | Create review (auto-recalculates boat rating) |
| `GET` | `/` | Public | List verified reviews (limit 6) |
| `GET` | `/my-review` | Customer / Owner | List own reviews |
| `GET` | `/:id` | Public | Get reviews for a boat |
| `PATCH` | `/:id` | Customer | Update review |
| `DELETE` | `/:id` | Admin | Delete review |

### Routes — `/api/v1/route`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create-route` | Admin | Create route with image |
| `GET` | `/` | Public | List all routes (search, filter, paginate) |
| `GET` | `/:id` | Public | Get route details |
| `PATCH` | `/:id` | Admin | Update route |
| `DELETE` | `/:id` | Admin | Delete route |

### Schedules — `/api/v1/schedule`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Boat Owner | Create schedule (supports recurring: DAILY/WEEKLY/MONTHLY) |
| `GET` | `/my-boat-schedule` | Boat Owner | List owner's schedules |
| `GET` | `/available-route/:id` | Public | Available schedules for a boat (today, UPCOMING) |
| `GET` | `/view-route/:id` | Public | View schedule with route details |
| `PATCH` | `/:id` | Boat Owner | Update schedule (ownership verified) |
| `DELETE` | `/:id` | Boat Owner | Delete schedule |

### Stats — `/api/v1/stats`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | All Roles | Role-based dashboard data (Admin: platform-wide; Owner: fleet; Customer: personal) |

### Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile` | All Roles | Get own profile with bookings & reviews |
| `PUT` | `/profile` | All Roles | Update profile (name, image upload) |
| `GET` | `/getalluser` | Admin | List all users (search, filter, paginate) |
| `PUT` | `/updaterole` | — | Update user role |
| `GET` | `/bookings` | Customer / Owner | Get user's bookings |
| `GET` | `/reviews` | Customer / Owner | Get user's reviews |
| `GET` | `/notifications` | Customer / Owner | Get user's notifications |
| `PUT` | `/notifications/:id/read` | Customer / Owner | Mark notification as read |
| `DELETE` | `/account-delete/:id` | — | Soft-delete user account |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** with [pgvector extension](https://github.com/pgvector/pgvector) (for RAG features)
- **Stripe CLI** (for local webhook testing)
- **Cloudinary** account
- **Google Cloud Console** project (for OAuth)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/boat-backend.git
cd boat-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in all required values (see Environment Variables section)

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Start development server
npm run dev
```

The server will start at `http://localhost:5000`.

### Local Stripe Webhook Testing

```bash
# In a separate terminal, forward Stripe events to your local server
npm run stripe:webhook
# This runs: stripe listen --forward-to localhost:5000/webhook
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ==============================
# App Config
# ==============================
PORT=5000
FRONTEND_URL=http://localhost:3000

# ==============================
# Database
# ==============================
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME

# ==============================
# Better Auth
# ==============================
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_TOKEN_EXPIRES_IN=7d

# ==============================
# JWT
# ==============================
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d

# ==============================
# Email (SMTP)
# ==============================
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_FROM="Boat Sea <your_email@example.com>"

# ==============================
# Google OAuth
# ==============================
Client_ID=your_google_client_id
Client_Secret=your_google_client_secret
Google_CallBack_URL=http://localhost:5000/api/auth/callback/google

# ==============================
# Stripe
# ==============================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEB_HOOK=whsec_...

# ==============================
# Cloudinary
# ==============================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ==============================
# OpenRouter (RAG / AI)
# ==============================
Open_Router_Api_key=your_openrouter_key
OPENROUTER_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-vl-1b-v2:free
OPENROUTER_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b:free
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload (`tsx watch`) |
| `npm run build` | Generate Prisma client + bundle with `tsup` (ESM, Node 20) |
| `npm start` | Start production server from `dist/` |
| `npm run stripe:webhook` | Forward Stripe webhook events to `localhost:5000/webhook` |
| `npm run lint` | Run ESLint on source files |

---

## ☁️ Deployment

The project is configured for **Vercel serverless** deployment.

### Vercel Configuration

`vercel.json` routes all requests through a single serverless function:

```json
{
  "version": 2,
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/api/index.js" }]
}
```

### Build Pipeline

1. `prisma generate` — generates the Prisma client
2. `tsup src/index.ts` — bundles to `api/index.js` (ESM, Node 20, externals: `pg-native`)
3. Vercel deploys `api/index.js` as a serverless function

### Key Deployment Notes

- **Prisma Driver Adapter** (`@prisma/adapter-pg`) is used instead of the default engine for Vercel compatibility
- **`postinstall` script** ensures Prisma client is generated after `npm install`
- **`@vercel/functions`** `waitUntil` is used for non-blocking email sends (prevents cold-start timeouts)

---

## 📄 License

ISC

---

<p align="center">
  Built with ❤️ using Node.js, Express, TypeScript, Prisma & PostgreSQL
</p>
