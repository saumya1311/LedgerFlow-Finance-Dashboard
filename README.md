# 📊 LedgerFlow — Ultimate Finance Dashboard

> **A high-performance, full-stack finance management system.** Built with a focus on security, scalability, and premium user experience, LedgerFlow provides organizations with a robust toolkit for tracking financial health through Role-Based Access Control (RBAC) and real-time analytics.

[![Frontend](https://img.shields.io/badge/Frontend-Next.js_16-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3.2-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-JWT_Auth-orange?style=for-the-badge)](https://jwt.io/)

---

## 🎯 Project Vision
LedgerFlow is designed to bridge the gap between simple expense tracking and complex enterprise financial auditing. It offers a **decoupled architecture**, ensuring the frontend can be scaled independently of the high-concurrency backend.

---

## 🚀 What's Inside? (The "What")

### 🔐 Multi-Tier Security
*   **JWT Stateless Auth**: Secure sessions without server-side state.
*   **RBAC Enforcement**: Strict access control at both UI (navigation/actions) and API (endpoint protection) layers.
*   **Bcrypt Hashing**: Industry-standard password security.

### 📈 Intelligent Analytics
*   **Dynamic Visualizations**: Integrated **Recharts** for monthly trends and categorical breakdowns.
*   **Real-time Aggregations**: Instant calculation of Balance, Income, and Expenses.
*   **CSV Auditor**: Export all transaction history for external accounting.

### 🛠️ Advanced Record Management
*   **Server-Side Logic**: High-performance filtering, searching, and pagination powered by Spring Data Specification.
*   **Soft Deletes**: Data integrity maintained through logical deletion.
*   **Audit Logging**: Automatic `createdAt` and `updatedAt` tracking for every entry.

---

## 🏗️ Technical Architecture (The "Where")

### Directory Structure
```text
.
├── finance_dashboard/         # Next.js 16 + React 19 Frontend
│   ├── src/app/               # App Router & Route Groups
│   ├── src/components/        # UI Atomic Components
│   ├── src/features/          # Logic-heavy functional modules
│   ├── src/services/          # API Integration Layer
│   └── src/store/             # Zustand State Management
│
└── finance-backend/           # Java 17 + Spring Boot 3.2 Backend
    ├── src/main/java/.../     # REST API Architecture
    │   ├── controller/        # Entry points & @PreAuthorize guards
    │   ├── service/           # Business logic & Calculations
    │   ├── model/             # JPA Entities (PostgreSQL Mapping)
    │   └── config/            # Security & JWT Configuration
    └── src/main/resources/    # Configuration (application.yml)
```

---

## ⚙️ Setup Instructions (The "How")

### 1. Database Setup (PostgreSQL)
Ensure you have a PostgreSQL instance running. Create a database named `ledgerflow`.
```sql
CREATE DATABASE ledgerflow;
```

### 2. Backend Configuration
Navigate to `finance-backend/src/main/resources/`. Create or update `application.yml`:
**⚠️ IMPORTANT:** Never commit your production credentials.
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ledgerflow
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:your_password_here}
  jpa:
    hibernate:
      ddl-auto: update
jwt:
  secret: ${JWT_SECRET:your_32_character_secret_here}
```
**To run:**
```bash
cd finance-backend
./mvnw spring-boot:run
```

### 3. Frontend Configuration
Navigate to `finance_dashboard/`. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
**To run:**
```bash
cd finance_dashboard
npm install
npm run dev
```

---

## 👥 Role Permissions Matrix

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| Dashboard Analytics | ✅ | ✅ | ✅ |
| View All Records | ✅ | ✅ | ❌ |
| Manage Transactions (CRUD) | ✅ | ❌ | ❌ |
| User Role Management | ✅ | ❌ | ❌ |
| Settings Access | ✅ | ✅ | ❌ |

---

## 📜 License
This project is open-source and intended for portfolio demonstration and educational use.

---

<p align="center">
  <strong>LedgerFlow</strong> — Engineering Financial Clarity.
</p>
