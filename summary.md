# LMS Platform - Project Documentation

## 1. Project Overview

### What This Project Is

A full-stack Learning Management System (LMS) built for educational institutions and independent instructors. The platform enables course creation, student enrollment, assignment management, progress tracking, and automated certificate generation.

### Why It Exists

Traditional learning management lacks centralized platforms where:
- Students can access courses, complete assignments, and earn verifiable certificates
- Instructors can manage content and evaluate submissions efficiently
- Administrators can oversee users and platform operations

### Users

| Role | Description |
|------|-------------|
| **Student** | Enrolls in courses, submits assignments, earns certificates |
| **Instructor** | Creates courses, designs assignments, grades submissions |
| **Admin** | Manages users, monitors platform, has full control |

---

## 2. System Architecture

```
┌─────────────┐     HTTP/REST      ┌─────────────┐
│   Frontend  │ ◄─────────────────► │   Backend   │
│  (React)    │     + Cookies       │  (Express)  │
└─────────────┘                     └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
             ┌───────────┐          ┌───────────┐          ┌───────────┐
             │ PostgreSQL│          │   SMTP    │          │  Uploads  │
             │  (Prisma) │          │ (MailHog) │          │  (Multer) │
             └───────────┘          └───────────┘          └───────────┘
```

### Data Flow

1. User interacts with React frontend
2. Frontend sends HTTP requests via Axios to Express API
3. Backend validates request through auth/role middleware
4. Controller processes business logic using Prisma ORM
5. Database operations complete
6. Response returns to frontend
7. React Query cache updates and UI re-renders

---

## 3. Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI with hooks |
| TypeScript | Static typing for reliability |
| Vite | Fast build tool with HMR |
| TailwindCSS | Utility-first styling |
| ShadCN UI | Accessible component primitives |
| React Query | Server state with caching |
| React Router v6 | Client-side routing |
| Framer Motion | UI animations |
| jsPDF + html2canvas | PDF certificate generation |
| Axios | HTTP client |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type-safe backend code |
| Prisma ORM | Database access with migrations |
| PostgreSQL | Relational data storage |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Nodemailer | SMTP email sending |
| Multer | File upload handling |
| Zod | Request validation |
| Socket.io | Real-time notifications |

---

## 4. Authentication Flow

### Registration Flow

```
User submits form → POST /api/auth/register → Validate input (Zod)
                                                    ↓
                                            Hash password (bcrypt)
                                                    ↓
                                            Create user (Prisma)
                                                    ↓
                                            Send welcome email (async)
                                                    ↓
                                            Generate JWT tokens
                                                    ↓
                                            Set HTTP-only cookies
                                                    ↓
                                            Return user data
```

### Login Flow

```
User submits credentials → POST /api/auth/login → Find user by email
                                                        ↓
                                                Compare password hash
                                                        ↓
                                                Generate JWT tokens
                                                        ↓
                                                Set HTTP-only cookies
                                                        ↓
                                                Return user data
```

### JWT Token Strategy

| Token | Expiry | Purpose |
|-------|--------|---------|
| Access Token | 15 min | API authorization |
| Refresh Token | 7 days | Obtain new access token |

### Protected Route Flow

```
Request → protect middleware → Verify JWT → Check user exists
                                                   ↓
                               authorize middleware → Check role
                                                           ↓
                                                      Controller
```

---

## 5. Email System

### Architecture

```
Registration → authController → sendVerificationEmail() → Nodemailer → SMTP Server
                                      ↓
                              Non-blocking (async)
                              Errors logged only
```

### Email Verification Flow

```
Register
  ↓
User created with isEmailVerified = false
  ↓
Verification email sent (with token link)
  ↓
User clicks link → GET /api/auth/verify-email?token=xxx
  ↓
Token validated, expiry checked
  ↓
isEmailVerified = true, token cleared
  ↓
Welcome email sent
  ↓
User can now login
```

**Why It Exists:**
- Prevents fake/spam registrations
- Ensures users have access to their email
- Required for password reset and notifications
- Industry standard security practice

**Security Features:**
- Tokens generated using `crypto.randomBytes(32)`
- 24-hour token expiry
- Tokens cleared after use
- Login blocked until verified

### Configuration

Environment variables in `.env`:

```env
SMTP_HOST=localhost        # SMTP server host
SMTP_PORT=1025             # SMTP port (1025 for MailHog)
SMTP_USER=                 # Optional: SMTP username
SMTP_PASS=                 # Optional: SMTP password
SMTP_FROM=noreply@lms.com  # Sender address
```

### Implementation

**File:** `backend/src/utils/email.ts`

- `sendVerificationEmail(to, name, token)` - Verification link email
- `sendWelcomeEmail(to, name)` - Post-verification welcome email
- Lazy transporter initialization
- Professional HTML templates

**Endpoints:**
- `POST /api/auth/register` - Creates user, sends verification email
- `GET /api/auth/verify-email?token=xxx` - Verifies email
- `POST /api/auth/resend-verification` - Resends verification email

### Frontend Pages

- `Register.tsx` - Shows "Check your email" after registration
- `VerifyEmail.tsx` - Handles verification link (success/error/expired states)
- `Login.tsx` - Shows "Resend verification" for unverified users

### Testing with MailHog

1. Start MailHog:
   ```bash
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

2. Register a new user

3. View email at: http://localhost:8025

4. Click verification link

5. Login with verified account

### Production Switch

Update `.env` for production SMTP (e.g., SendGrid):

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

---

## 6. Role-Based Functionality

### Student

| Feature | Route |
|---------|-------|
| Browse courses | `/courses` |
| Enroll in course | `/courses/:id` |
| View assignments | `/courses/:courseId/assignments` |
| Submit assignment | `/assignments/:id` |
| Track progress | `/dashboard` |
| Download certificate | `/certificates` |
| Settings | `/settings` |

### Instructor

| Feature | Route |
|---------|-------|
| Dashboard with stats | `/instructor/dashboard` |
| Create/edit courses | `/instructor/courses` |
| Manage assignments | `/instructor/assignments` |
| Review submissions | `/instructor/submissions` |

### Admin

| Feature | Route |
|---------|-------|
| Platform analytics | `/admin/dashboard` |
| User management | `/admin/users` |
| Review all submissions | `/admin/submissions` |
| Create assignments | `/admin/assignments/new` |

---

## 7. Folder Structure

```
TASK-4/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   ├── migrations/        # Migration history
│   │   └── seedCourses.ts     # Demo data seeder
│   ├── src/
│   │   ├── config/            # DB client, Socket.io
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # auth, roles, upload
│   │   ├── routes/            # API route definitions
│   │   ├── utils/
│   │   │   ├── jwt.ts         # Token generation
│   │   │   └── email.ts       # SMTP email utility
│   │   └── server.ts          # Express app setup
│   ├── uploads/               # User uploaded files
│   └── .env                   # Environment config
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── layouts/           # Main + Dashboard layouts
│   │   ├── context/           # AuthContext provider
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API + Socket clients
│   │   └── App.tsx            # Route definitions
│   └── .env                   # Frontend env config
│
└── summary.md                 # This documentation
```

---

## 8. Environment and Setup

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Docker (for MailHog) or MailHog binary

### Backend Setup

```bash
cd backend
npm install

# Configure .env (copy from .env.example)
# Set DATABASE_URL, JWT secrets, SMTP config

npx prisma migrate dev
npx prisma generate
npx ts-node prisma/seedCourses.ts  # Optional: seed demo data

npm run dev  # Runs on http://localhost:5001
```

### Frontend Setup

```bash
cd frontend
npm install

# Configure .env
# VITE_API_URL=http://localhost:5001/api

npm run dev  # Runs on http://localhost:5174
```

### Required Environment Variables

**Backend (.env):**

```env
PORT=5001
DATABASE_URL=postgresql://user:pass@localhost:5432/lms_db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@lms.com
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://localhost:5001
```

---

## 9. Key Design Decisions

### Non-Blocking Email

Email sending is async with error catching. This ensures:
- Registration always succeeds even if SMTP is down
- No user-facing errors for email failures
- Errors are logged for debugging

### Centralized Utilities

- `utils/jwt.ts` - Token generation and cookie management
- `utils/email.ts` - All email logic in one place
- Easy to modify or extend without touching controllers

### HTTP-Only Cookies

JWTs stored in HTTP-only cookies prevent XSS attacks. No localStorage for sensitive tokens.

### Environment-Based Configuration

All secrets and configuration via `.env`:
- Easy deployment across environments
- No hardcoded credentials
- Production switch without code changes

### React Query for State

Server state managed by React Query:
- Automatic caching
- Background refetching
- Optimistic updates
- Reduced API calls

---

## 10. Future Scope

- [x] Email verification on registration
- [ ] Password reset via email
- [ ] Real-time notifications (Socket.io integration)
- [ ] Video conferencing for live classes
- [ ] Payment gateway for paid courses
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Discussion forums per course
- [ ] Quiz/exam functionality with auto-grading
- [ ] Dark mode toggle
