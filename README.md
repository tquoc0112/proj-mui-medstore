🏪 MedStore Online — Fullstack Pharmacy App
MedStore Online is a modern web application for managing a digital pharmacy storefront. It supports two main roles: Customers and Sellers, with secure role-based authentication, profile management, and business registration support for sellers. Admin functionality is also under development.

🔧 Tech Stack
Frontend: React + TypeScript + Vite + MUI v7.2.0

Backend: Node.js + Express + Prisma + TypeScript

Database: PostgreSQL

Authentication: JWT (JSON Web Token)

Roles: CUSTOMER, SELLER (with approval flow), and ADMIN

UI Design: Soft white-blue medical theme with modern UX patterns

🔐 Features (In Progress)
User Registration and Login (with role selection)

Seller onboarding with business details

JWT authentication and localStorage handling

Role-based redirects and protected routes

Profile viewing and editing (including profile pictures)

Admin Dashboard (Pending)

Validation of Seller accounts (Pending)

📦 Folder Structure Highlights
backend/
├── prisma/                # Prisma schema & migrations
├── routes/                # auth.ts, user.ts, admin.ts
├── controllers/           # Logic for each route
├── middleware/            # Auth middleware (e.g., verifyToken)
└── index.ts               # Express app entry point

frontend/
├── src/
│   ├── pages/AuthPage.tsx # Login & Register forms with animation
│   ├── styles/Auth.css    # Custom animation CSS
│   └── App.tsx            # Root router entry
🧪 Status
✅ Basic Auth complete
✅ JWT and role-based redirects
✅ Customer/Seller profile API
🟨 Admin features under construction
🟨 UI polish and validations ongoing

API route documentation

screenshots or deployment links
