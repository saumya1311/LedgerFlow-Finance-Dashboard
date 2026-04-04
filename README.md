# LedgerFlow
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/9d5c7de9-c111-4981-a92d-e248b1de060a" />
<img width="1902" height="872" alt="Screenshot 2026-04-05 004718" src="https://github.com/user-attachments/assets/34f0c31c-5c09-4c04-bbd3-0d457e8bbf43" />

Full-stack finance dashboard focused on secure API design, role-based access control, and maintainable backend architecture.

[![Frontend](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Auth](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)](https://jwt.io/)

---

## Overview

LedgerFlow provides:

- JWT-based authentication with stateless session handling
- Backend-enforced RBAC (`ADMIN`, `ANALYST`, `VIEWER`)
- Transaction lifecycle management with soft delete semantics
- Filtered and paginated querying via JPA Specification
- Dashboard-level financial aggregation for reporting

The repository contains:

```text
.
├── finance_dashboard/    # Next.js frontend
└── finance-backend/      # Spring Boot REST API
```

---

## Backend Architecture

`finance-backend` follows a layered architecture:

- **Controller Layer**: HTTP entry points, request mapping, authorization annotations
- **Service Layer**: business rules, access validation, aggregation logic
- **Repository Layer**: JPA repositories + query methods/specifications
- **Model Layer**: entities and enums mapped to PostgreSQL
- **Security Layer**: JWT filter chain, stateless auth, method-level guards

### Logical Data Flow

1. Request enters controller (`/api/**`)
2. JWT filter validates token and populates security context
3. Controller delegates to service
4. Service enforces domain rules and role constraints
5. Repository executes DB operations
6. DTO response returned with proper HTTP status

---

## API Endpoints

Base URL: `http://localhost:8080/api`

### Auth

- `POST /auth/login` - Authenticate user and return JWT + user payload
- `POST /auth/register` - Register a new user (default role: `VIEWER`) and return auth payload

### Users

- `GET /users` - List all users (admin only)
- `PUT /users/{id}/role` - Update a user's role (admin only)

### Transactions

- `GET /records` - List records with pagination and optional filters (`type`, `category`)
- `POST /records` - Create a record (admin only)
- `PUT /records/{id}` - Update a record (admin only)
- `DELETE /records/{id}` - Soft delete a record (admin only)

### Dashboard

- `GET /dashboard/stats` - Return aggregated totals (`totalIncome`, `totalExpenses`, `netBalance`) with optional date range (`from`, `to`)

---

## Health Check

- `GET /actuator/health` - Health endpoint for container orchestration/readiness checks

---

## Access Control (Backend-Enforced)

Roles:

- `ADMIN`: full access, including user role management and record mutation
- `ANALYST`: authenticated read access to records and dashboard data
- `VIEWER`: authenticated read access to dashboard/records; write operations blocked

Enforcement points:

- Endpoint-level restrictions via `@PreAuthorize` on protected controllers
- Method-level role checks in service logic (defense in depth)
- Spring Security default rule: all non-auth routes require authenticated JWT

---

## Validation & Error Handling

### Input Validation

Validation is applied using Jakarta Bean Validation (`@Valid`) on request DTOs:

- Auth: email format, required password, field length constraints
- Records: required title, amount, type, category, and date
- Invalid payloads are rejected before business logic executes

### Error Handling Strategy

Centralized with `@ControllerAdvice`:

- `MethodArgumentNotValidException` -> structured validation error map
- `ResourceNotFoundException` -> `404 Not Found`
- `UnauthorizedAccessException` -> `403 Forbidden`
- Unhandled exceptions -> `500 Internal Server Error`

### HTTP Status Usage

- `200 OK` for successful reads/updates
- `201 Created` for resource creation
- `204 No Content` for successful soft deletion
- `400 Bad Request` for malformed input/invalid role values
- `401 Unauthorized` for missing/invalid token at security boundary
- `403 Forbidden` for authenticated users lacking permissions
- `404 Not Found` for missing resources

---

## Database Schema Overview

Core tables:

- **`users`**
  - `id` (PK)
  - `name`
  - `email` (unique)
  - `password` (bcrypt hash)
  - `role` (`ADMIN | ANALYST | VIEWER`)
  - `created_at`, `updated_at`

- **`records`**
  - `id` (PK)
  - `title`
  - `amount`
  - `type` (`INCOME | EXPENSE`)
  - `category`
  - `date`
  - `user_id` (FK -> `users.id`)
  - `deleted` (soft delete flag)
  - `created_at`, `updated_at`

Relationship:

- One `user` to many `records`

---

## Design Decisions

- **JWT Authentication**: keeps API stateless and horizontally scalable; avoids server session storage
- **RBAC**: separates privileges by responsibility, reducing accidental or unauthorized mutations
- **Soft Deletes**: preserves auditability and historical integrity while excluding deleted rows from active reads
- **Specification-based Querying**: enables composable filtering and pagination without endpoint proliferation

---

## Local Setup

### 1) Prerequisites

- Java 17+
- Maven (or Maven Wrapper)
- Node.js 18+
- PostgreSQL 14+

### 2) Database

Create database:

```sql
CREATE DATABASE ledgerflow;
```

### 3) Backend Configuration

Create/update `finance-backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

app:
  jwtSecret: ${JWT_SECRET}

server:
  port: ${PORT:8080}
```

Required environment variables:

- `SPRING_DATASOURCE_URL` (example: `jdbc:postgresql://localhost:5432/ledgerflow`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `PORT` (optional; defaults to `8080`)

Run backend:

```bash
cd finance-backend
./mvnw spring-boot:run
```

### 4) Frontend Configuration

Create `finance_dashboard/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Run frontend:

```bash
cd finance_dashboard
npm install
npm run dev
```

---

## Docker Setup

Build backend image:

```bash
cd finance-backend
docker build -t ledgerflow-backend .
```

Run backend container:

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database> \
  -e DB_USERNAME=<db_username> \
  -e DB_PASSWORD=<db_password> \
  -e JWT_SECRET=<jwt_secret> \
  -e PORT=8080 \
  ledgerflow-backend
```

---

## Security Notes (Read Before Deploying)

- Never commit `.env*`, production `application.yml`, or any secret-bearing file
- Never hardcode credentials, JWT secrets, or tokens in source code
- Use strong, rotated secrets in environment variables or a secret manager
- Use placeholders in docs/examples only (`YOUR_DB_PASSWORD`, `YOUR_JWT_SECRET`)
- Treat JWT secrets and DB credentials as sensitive production assets

---

## Future Improvements

- Refresh token flow with token revocation and device/session tracking
- OpenAPI/Swagger documentation with request/response examples
- Database migrations via Flyway for controlled schema evolution
- Fine-grained authorization policies (resource-level permissions)
- Observability stack (structured logs, metrics, tracing, alerting)
- Automated integration and security testing in CI pipeline

---

## License

This project is intended for portfolio demonstration and technical evaluation.
