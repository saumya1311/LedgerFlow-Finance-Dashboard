# LedgerFlow — Finance Dashboard

> A modern, full-stack finance dashboard with Role-Based Access Control, real-time analytics, and a glassmorphic UI.

![Tech Stack](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=nextdotjs)
![Tech Stack](https://img.shields.io/badge/Backend-Spring_Boot_3.2-6DB33F?style=for-the-badge&logo=springboot)
![Tech Stack](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/State-Zustand-purple?style=for-the-badge)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Frontend Pages & Components](#frontend-pages--components)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [Demo Accounts](#demo-accounts)
- [Configuration](#configuration)
- [Known Limitations](#known-limitations)

---

## Overview

**LedgerFlow** is a secure, production-grade finance management system built with a decoupled architecture. It features a **Next.js 14** frontend communicating with a **Spring Boot 3.2** REST API backend, secured with **JWT authentication** and enforced **Role-Based Access Control (RBAC)** at both the UI and API layers.

The system allows organizations to track income and expenses, view interactive analytics dashboards, manage financial records, and control user access through a hierarchical role system.

---

## Key Features

### 🔐 Authentication & Security
- **JWT-based authentication** — Stateless token auth with auto-login on registration
- **Password encryption** — BCrypt hashing via Spring Security
- **Protected routes** — Frontend route guards redirect unauthenticated users to `/login`
- **API-level authorization** — `@PreAuthorize` annotations enforce role restrictions on every endpoint
- **Token persistence** — JWT stored in `localStorage` and auto-attached to API requests

### 📊 Dashboard & Analytics
- **Summary Cards** — Real-time Total Income, Total Expenses, and Net Balance
- **Bar Charts** — Monthly income vs. expense breakdown (Recharts)
- **Pie Charts** — Category-wise expense distribution (Top 5)
- **Recent Transactions** — Quick-view list of the latest 5 records
- **CSV Export** — Download all finance records as a `.csv` report file

### 📝 Records Management
- **CRUD Operations** — Create, Read, Update, and Delete financial records
- **Filtering** — Filter records by type (Income/Expense) and search by category
- **Pagination** — Server-side pagination with configurable page size
- **Soft Delete** — Records are marked as `deleted = true` rather than destroyed
- **Inline Editing** — Edit records directly from the records table via a modal form

### 👥 User Management (Admin Only)
- **User List** — View all registered users with their roles and registration dates
- **Role Promotion** — Elevate users from Viewer → Analyst → Admin

### 🎨 UI/UX Design
- **Glassmorphic Login** — Frosted-glass login card over an isometric 3D dashboard background
- **Dark Sidebar** — Gradient-branded navigation with role-filtered menu items
- **Micro-animations** — Slide-in, fade-in, and hover transitions throughout the UI
- **Responsive Layout** — Mobile-friendly grid system with adaptive breakpoints
- **Toast Notifications** — Real-time success/error feedback via `sonner`

---

## Tech Stack

| Layer       | Technology                       | Purpose                           |
|-------------|----------------------------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router)          | React framework with SSR support  |
| Language    | TypeScript                       | Type-safe frontend development    |
| Styling     | Tailwind CSS                     | Utility-first responsive styling  |
| State       | Zustand                          | Lightweight global state manager  |
| Charts      | Recharts                         | Interactive data visualizations   |
| HTTP Client | Fetch API (custom `apiFetch`)    | API communication with JWT        |
| Backend     | Spring Boot 3.2.4                | REST API server                   |
| Security    | Spring Security + JWT            | Authentication & authorization    |
| ORM         | Spring Data JPA (Hibernate)      | Database abstraction              |
| Database    | H2 (in-memory)                   | Development database              |
| Build Tool  | Maven (mvnw wrapper)             | Java dependency management        |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                    BROWSER                       │
│  ┌────────────────────────────────────────────┐  │
│  │          Next.js 14 Frontend               │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │ Zustand  │ │ Services │ │ Components │  │  │
│  │  │  Store   │ │  Layer   │ │  & Pages   │  │  │
│  │  └────┬────┘ └─────┬────┘ └────────────┘  │  │
│  │       │            │                       │  │
│  │       └────────────┤  apiFetch() + JWT     │  │
│  └────────────────────┼───────────────────────┘  │
│                       │ HTTP (localhost:3000)     │
├───────────────────────┼──────────────────────────┤
│                       ▼ REST API                 │
│  ┌────────────────────────────────────────────┐  │
│  │       Spring Boot 3.2 Backend              │  │
│  │  ┌────────────┐ ┌──────────┐ ┌─────────┐  │  │
│  │  │ Controllers│ │ Services │ │ Security│  │  │
│  │  │            │ │          │ │  (JWT)  │  │  │
│  │  └─────┬──────┘ └─────┬───┘ └─────────┘  │  │
│  │        │              │                    │  │
│  │        └──────────────┤                    │  │
│  │                       │                    │  │
│  │  ┌────────────────────▼─────────────────┐  │  │
│  │  │     Spring Data JPA (Hibernate)      │  │  │
│  │  │          H2 Database                 │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
│                   (localhost:8080)                │
└──────────────────────────────────────────────────┘
```

---

## Role-Based Access Control (RBAC)

Security is enforced at **two layers**: the frontend (UI visibility) and the backend (API authorization).

### Role Permissions Matrix

| Feature                  | Admin | Analyst | Viewer |
|--------------------------|:-----:|:-------:|:------:|
| View Dashboard           | ✅    | ✅      | ✅     |
| View Dashboard Stats     | ✅    | ✅      | ✅     |
| Export CSV Report         | ✅    | ✅      | ✅     |
| View Records Page        | ✅    | ✅      | ❌     |
| Create Records           | ✅    | ❌      | ❌     |
| Edit Records             | ✅    | ❌      | ❌     |
| Delete Records           | ✅    | ❌      | ❌     |
| View Settings Page       | ✅    | ✅      | ❌     |
| View User Management     | ✅    | ❌      | ❌     |
| Promote User Roles       | ✅    | ❌      | ❌     |

### Frontend Enforcement

- **Sidebar Navigation** — Menu items are conditionally rendered based on `currentUser.role`. Viewers only see "Dashboard" and "Sign Out".
- **Route Guards** — Pages like `/records`, `/settings`, and `/users` check `currentUser.role` on mount. Unauthorized roles see a "Unauthorized Access" screen.
- **Button Visibility** — Action buttons (New Entry, Edit, Delete) are hidden for roles without permission.

### Backend Enforcement

- **`@PreAuthorize` Annotations** — Controller methods are annotated with `@PreAuthorize("hasRole('ADMIN')")` to block unauthorized API calls.
- **Service-Layer Validation** — `RecordService.validateWriteAccess()` throws `UnauthorizedAccessException` for Viewers attempting write operations.
- **JWT Role Claims** — The user's role is embedded in the JWT payload and extracted by Spring Security on every request.

### Default Role Assignment

- New users who register are **automatically assigned the `VIEWER` role**.
- Only an **Admin** can promote a user's role via the User Management page (`/users`).

---

## Project Structure

### Frontend (`finance_dashboard/`)

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (metadata, fonts, Toaster)
│   ├── page.tsx                  # Entry point — redirects to /login or dashboard
│   ├── globals.css               # Global styles & Tailwind config
│   ├── login/
│   │   └── page.tsx              # Login/Register page (glassmorphic UI)
│   └── (dashboard)/              # Route group (authenticated layout)
│       ├── layout.tsx            # Dashboard shell with Sidebar
│       ├── page.tsx              # Main Dashboard (stats, charts, transactions)
│       ├── records/
│       │   └── page.tsx          # Records management (CRUD table)
│       ├── settings/
│       │   └── page.tsx          # Settings page
│       └── users/
│           └── page.tsx          # User Management (Admin only)
├── components/
│   └── layout/
│       └── Sidebar.tsx           # Role-filtered sidebar navigation
├── features/
│   ├── dashboard/
│   │   ├── SummaryCards.tsx       # Income/Expense/Balance stat cards
│   │   ├── DashboardCharts.tsx   # Bar chart + Pie chart
│   │   └── RecentTransactions.tsx# Latest 5 transactions list
│   └── records/
│       ├── RecordTable.tsx       # Data table with role-gated actions
│       └── RecordForm.tsx        # Create/Edit record modal form
├── services/
│   ├── apiClient.ts              # Fetch wrapper with JWT auto-attach
│   ├── authService.ts            # Login, Register, Logout logic
│   ├── recordService.ts          # CRUD operations + dashboard stats
│   └── userService.ts            # User list + role update API calls
├── store/
│   └── useStore.ts               # Zustand global state (user, records)
└── types/
    └── index.ts                  # TypeScript interfaces (User, Record, etc.)
```

### Backend (`finance-backend/`)

```
src/main/java/com/finance/api/
├── FinanceApplication.java       # Spring Boot entry point
├── config/
│   ├── SecurityConfig.java       # Spring Security filter chain, CORS
│   ├── JwtUtils.java             # JWT token generation & validation
│   ├── JwtAuthFilter.java        # Request filter to extract JWT
│   ├── JpaAuditingConfig.java    # Auto-populate createdAt/updatedAt
│   └── DataSeeder.java           # Seeds demo users & sample records
├── controller/
│   ├── AuthController.java       # POST /api/auth/login, /register
│   ├── DashboardController.java  # GET /api/dashboard/stats
│   ├── RecordController.java     # CRUD /api/records (role-protected)
│   └── UserController.java       # GET/PUT /api/users (Admin only)
├── dto/
│   ├── LoginRequest.java         # Login request body
│   ├── SignupRequest.java        # Registration request body
│   ├── AuthResponse.java         # JWT + user info response
│   ├── RecordRequestDTO.java     # Create/Update record body
│   ├── RecordResponseDTO.java    # Record API response shape
│   ├── DashboardStatsDTO.java    # Aggregated dashboard statistics
│   └── UserDto.java              # User API response shape
├── model/
│   ├── User.java                 # User JPA entity
│   ├── UserRole.java             # Enum: ADMIN, ANALYST, VIEWER
│   ├── Record.java               # Financial record JPA entity
│   └── RecordType.java           # Enum: INCOME, EXPENSE
├── repository/
│   ├── UserRepository.java       # User JPA repository
│   └── RecordRepository.java     # Record JPA repository (custom queries)
├── service/
│   └── RecordService.java        # Business logic, stats calculation
└── exception/
    ├── ResourceNotFoundException.java
    └── UnauthorizedAccessException.java
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Java JDK** ≥ 17
- **npm** or **yarn**

### 1. Start the Backend

```bash
cd finance-backend
.\mvnw.cmd spring-boot:run        # Windows
# ./mvnw spring-boot:run          # macOS / Linux
```

The API server starts at **http://localhost:8080**.  
H2 Console is available at **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:financedb`).

### 2. Start the Frontend

```bash
cd finance_dashboard
npm install
npm run dev
```

The app opens at **http://localhost:3000**.

### 3. Open the App

Navigate to `http://localhost:3000`. You will be redirected to the **Login** page. Use one of the [demo accounts](#demo-accounts) or register a new account.

---

## API Reference

All endpoints are prefixed with `/api`. Authenticated endpoints require `Authorization: Bearer <JWT>` header.

### Authentication

| Method | Endpoint           | Body                                     | Response        | Auth |
|--------|--------------------|-----------------------------------------|-----------------|------|
| POST   | `/api/auth/login`  | `{ email, password }`                    | `AuthResponse`  | ❌   |
| POST   | `/api/auth/register` | `{ name, email, password }`            | `AuthResponse`  | ❌   |

**AuthResponse:**
```json
{
  "token": "eyJhbGciOi...",
  "userId": 1,
  "email": "admin@finance.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

### Records

| Method | Endpoint           | Description              | Auth  | Roles        |
|--------|--------------------|--------------------------| ------|------------- |
| GET    | `/api/records`     | List all records (paginated) | ✅ | All          |
| POST   | `/api/records`     | Create a new record      | ✅    | Admin        |
| PUT    | `/api/records/:id` | Update existing record   | ✅    | Admin        |
| DELETE | `/api/records/:id` | Soft-delete a record     | ✅    | Admin        |

**Query Parameters for GET `/api/records`:**
- `type` — Filter by `INCOME` or `EXPENSE`
- `category` — Search by category name (partial match)
- `page` — Page number (default: 0)
- `size` — Page size (default: 10)
- `sort` — Sort field (default: `date,desc`)

**RecordRequestDTO:**
```json
{
  "title": "Office Supplies",
  "amount": 250.00,
  "type": "EXPENSE",
  "category": "Operations",
  "date": "2026-04-01"
}
```

### Dashboard

| Method | Endpoint              | Description                      | Auth | Roles |
|--------|-----------------------|----------------------------------|------|-------|
| GET    | `/api/dashboard/stats`| Aggregated income/expense stats  | ✅   | All   |

**Query Parameters:**
- `from` — Start date (ISO format, default: 1 month ago)
- `to` — End date (ISO format, default: today)

**DashboardStatsDTO:**
```json
{
  "totalIncome": 45000.00,
  "totalExpenses": 12500.00,
  "netBalance": 32500.00
}
```

### Users (Admin Only)

| Method | Endpoint               | Description          | Auth | Roles |
|--------|------------------------|----------------------|------|-------|
| GET    | `/api/users`           | List all users       | ✅   | Admin |
| PUT    | `/api/users/:id/role`  | Update a user's role | ✅   | Admin |

**Role Update Body:**
```json
{ "role": "ANALYST" }
```

---

## Frontend Pages & Components

### Login Page (`/login`)

- **Glassmorphic UI** — Frosted-glass card (`bg-white/40 backdrop-blur-3xl`) centered over a 3D isometric dashboard background built with pure CSS transforms.
- **Sign In / Sign Up Toggle** — Seamlessly switch between login and registration forms.
- **Quick Access Demos** — One-click buttons to autofill demo credentials (Admin, Analyst, Viewer).
- **Gradient CTA Button** — Hover effect fills the button with a blue-to-indigo gradient sweep.

### Dashboard (`/`)

- **Welcome Header** — Personalized greeting with the logged-in user's first name.
- **Summary Cards** — Three animated stat cards showing Total Income, Total Expenses, and Net Balance with trend indicators.
- **Bar Chart** — Monthly income vs. expense comparison using Recharts `BarChart`.
- **Pie Chart** — Top 5 expense categories using Recharts `PieChart`.
- **Recent Transactions** — Latest 5 records with amount, type indicator, and date.
- **Export Report** — Downloads all records as a timestamped CSV file.
- **New Entry Button** — (Admin only) Redirects to the Records page to create a new record.

### Records (`/records`)

- **Data Table** — Paginated table of all financial records with columns: Title, Amount, Type, Category, Date, and Actions.
- **Add New Record** — (Admin only) Opens a modal form to create a new income/expense entry.
- **Edit Record** — (Admin only) Opens a pre-filled modal to edit an existing record.
- **Delete Record** — (Admin only) Soft-deletes a record with confirmation.
- **Type Filter** — Dropdown to filter by Income, Expense, or All.
- **Search** — Text search across record categories.
- **Viewer Block** — Viewers who manually navigate to `/records` see an "Unauthorized Access" screen.

### Settings (`/settings`)

- **Settings Sections** — Profile, Security, Privacy, Notifications, and System Connectivity cards.
- **Danger Zone** — Account deletion section with a prominent destructive action button.
- **Viewer Block** — Viewers are redirected to an "Unauthorized Access" screen.

### User Management (`/users`) — Admin Only

- **User Table** — Lists all registered users with their name, email, role, and join date.
- **Role Promotion** — Dropdown to change a user's role to Viewer, Analyst, or Admin, with instant API call.
- **Non-Admin Block** — Non-admin users who manually navigate to `/users` see an "Unauthorized Access" screen.

### Sidebar

- **Role-Filtered Navigation** — Menu items are dynamically filtered. Viewers only see "Dashboard". Analysts see "Dashboard", "Records", "Settings". Admins see everything including "Users".
- **Active State** — Current page is highlighted with a blue accent and background.
- **Sign Out** — Clears JWT from `localStorage`, resets Zustand store, and redirects to `/login`.

---

## Authentication Flow

```
1. User submits email/password on /login
          │
2. Frontend calls POST /api/auth/login
          │
3. Backend validates credentials via Spring Security AuthenticationManager
          │
4. Backend generates JWT with claims: { sub: email, userId, role, exp }
          │
5. Backend returns AuthResponse { token, userId, email, name, role }
          │
6. Frontend stores JWT in localStorage
   Frontend decodes JWT to extract role
   Frontend updates Zustand store with user object
          │
7. Frontend redirects to / (Dashboard)
          │
8. All subsequent API calls attach "Authorization: Bearer <token>" header
          │
9. Backend JwtAuthFilter intercepts requests, validates token,
   sets SecurityContext with user's GrantedAuthority (role)
          │
10. @PreAuthorize checks role before executing controller methods
```

### Registration Flow

- New users register via `POST /api/auth/register`
- They are assigned the **VIEWER** role by default
- The backend auto-logs them in and returns a JWT immediately
- An Admin must manually promote them via the `/users` page

---

## Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  Component   │────▶│   Service    │────▶│   apiFetch()   │
│  (page.tsx)  │     │ (recordSvc)  │     │  + JWT Header  │
└──────┬──────┘     └──────┬───────┘     └────────┬───────┘
       │                   │                      │
       │                   │              REST API (8080)
       │                   │                      │
       │                   │              ┌───────▼────────┐
       │                   │              │  Controller    │
       │                   │              │ (@PreAuthorize)│
       │                   │              └───────┬────────┘
       │                   │                      │
       │                   │              ┌───────▼────────┐
       │                   │              │   Service      │
       │                   │              │  (Business     │
       │                   │              │   Logic)       │
       │                   │              └───────┬────────┘
       │                   │                      │
       │                   │              ┌───────▼────────┐
       │                   │              │  Repository    │
       │                   │              │  (JPA / H2)    │
       │                   │              └────────────────┘
       │                   │
       ▼                   ▼
┌─────────────────────────────┐
│     Zustand Store           │
│  (Reactive State Update)    │
│  ┌─────────┐ ┌───────────┐ │
│  │  user   │ │  records  │ │
│  └─────────┘ └───────────┘ │
└─────────────────────────────┘
```

1. **Component** calls a **Service** method (e.g., `recordService.getRecords()`)
2. **Service** calls `apiFetch()` which attaches the JWT and hits the Spring Boot API
3. **Controller** checks `@PreAuthorize` for role authorization
4. **Service** performs business logic and queries the **Repository**
5. **Repository** executes against the **H2 database**
6. Response flows back → Service updates **Zustand Store** → Component re-renders

---

## Demo Accounts

The backend seeds the following demo accounts on startup via `DataSeeder.java`:

| Role    | Email                  | Password     | Access Level                              |
|---------|------------------------|-------------|-------------------------------------------|
| Admin   | `admin@finance.com`    | `admin123`  | Full access — all CRUD, user management   |
| Analyst | `analyst@finance.com`  | `analyst123`| Dashboard + Records (read-only)           |
| Viewer  | `viewer@finance.com`   | `viewer123` | Dashboard only (read-only)                |

---

## Configuration

### Frontend Environment Variables

Create `.env.local` in `finance_dashboard/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend Configuration (`application.properties`)

Key properties in `finance-backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# H2 Database
spring.datasource.url=jdbc:h2:mem:financedb
spring.datasource.driver-class-name=org.h2.Driver
spring.h2.console.enabled=true

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=<your-secret-key>
jwt.expiration.ms=86400000
```

---

## Known Limitations

| Item                       | Details |
|----------------------------|---------|
| **In-Memory Database**     | H2 resets on every restart. All data (users, records) is re-seeded from `DataSeeder.java`. Migrate to PostgreSQL for persistence. |
| **No Forgot Password**     | The "Forgot?" link on the login page is a placeholder — no email reset flow is implemented. |
| **No Pagination UI**       | Server-side pagination is implemented but the frontend doesn't render page navigation controls. |
| **Chart Resize Warnings**  | Console warnings about `width(-1)` / `height(-1)` from Recharts during initial container render. |
| **Settings Page**          | Settings sections are UI-only placeholders — no actual configuration is persisted. |
| **Single Tenant**          | All users share the same pool of financial records. No multi-tenant organization support. |

---

## License

This project is for educational and demonstration purposes.

---

<p align="center">
  <strong>LedgerFlow</strong> — Built with precision. Secured by design.
</p>
