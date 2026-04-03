# Finance Dashboard Backend - Production Ready

This is an upgraded, production-ready version of the Finance Dashboard API.

## Key Enhancements
- **Authentication**: Replaced header-based RBAC with **Spring Security + JWT**.
- **User Management**: Integrated `User` entity with roles and BCrypt password hashing.
- **Relational Data**: `Record` entity now belongs to a `User` via `@ManyToOne`.
- **Advanced Querying**:
  - **Pagination**: Supports `page` and `size`.
  - **Filtering**: Filter records by type and category.
  - **Sorting**: Sort by any field (e.g., `amount`, `date`).
- **Date Range Support**: Dashboard stats now accept `from` and `to` date parameters.
- **Data Integrity**: **Soft Delete** logic and **Audit Fields** (`createdAt`, `updatedAt`).

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- Spring Security
- JSON Web Token (jjwt)
- Spring Data JPA (Specifications, Pagination)
- Validation, Lombok

## Getting Started

### Default Accounts (Initialized on Start)
| Role | Email | Password |
| :--- | :--- | :--- |
| **ADMIN** | `admin@finance.com` | `admin123` |
| **ANALYST** | `analyst@finance.com` | `analyst123` |
| **VIEWER** | `viewer@finance.com` | `viewer123` |

### API Endpoints

#### Authentication
- `POST /api/auth/login`: Login with email/password to retrieve JWT.

#### Records (Secured)
- `GET /api/records`: Paginated & Filterable list.
  - Parameters: `type`, `category`, `page`, `size`, `sort`.
- `POST /api/records`: Create (ADMIN/ANALYST only).
- `PUT /api/records/{id}`: Update (ADMIN/ANALYST only).
- `DELETE /api/records/{id}`: Soft delete (ADMIN/ANALYST only).

#### Dashboard (Secured)
- `GET /api/dashboard/stats`: Stats by date range.
  - Parameters: `from=YYYY-MM-DD`, `to=YYYY-MM-DD`.

## Sample CURL Commands

### 1. Login to get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@finance.com", "password": "admin123"}'
```
*Note: Copy the `token` from the response.*

### 2. Get Paginated Records (ADMIN)
```bash
curl -X GET "http://localhost:8080/api/records?page=0&size=5&sort=amount,desc" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 3. Filter Records by Type
```bash
curl -X GET "http://localhost:8080/api/records?type=EXPENSE" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 4. Get Dashboard Stats for specific range
```bash
curl -X GET "http://localhost:8080/api/dashboard/stats?from=2024-01-01&to=2026-12-31" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
