# LMS Platform - Technical Summary

## 1. Project Overview

### Problem Statement

Traditional learning management lacks centralized platforms where students can access courses, complete assignments, track progress, and earn certifications in a unified experience. Educational institutions and independent instructors need scalable solutions to manage course content, evaluate student submissions, and issue verifiable credentials.

### Users

- **Students**: Individuals seeking to enroll in courses, complete assignments, and earn certificates
- **Instructors**: Educators who create course content, design assignments, and evaluate student work
- **Administrators**: Platform managers who oversee users, courses, and system-wide operations

### Value Proposition

This LMS platform provides a complete learning ecosystem with role-based access, real-time progress tracking, assignment management with file submissions, and automated certificate generation. It streamlines the educational workflow from course creation to certification.

### Real-World Use Case

An online training academy uses this platform to deliver professional development courses. Students browse the course catalog, enroll in programs, complete graded assignments, and receive downloadable certificates upon course completion. Instructors manage their course materials and grade submissions, while administrators monitor platform activity and manage user accounts.

---

## 2. High-Level System Architecture

### Frontend to Backend to Database Flow

1. User interacts with React frontend components
2. Frontend makes HTTP requests via Axios to Express API endpoints
3. Backend controllers process requests through middleware (authentication, authorization)
4. Controllers interact with PostgreSQL database via Prisma ORM
5. Response data flows back through the API to update React Query cache
6. UI re-renders with fresh data

### Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Backend validates credentials using bcrypt password comparison
3. JWT access token (15min) and refresh token (7 days) are generated
4. Tokens are sent as HTTP-only cookies
5. Subsequent requests include cookies automatically
6. `protect` middleware validates tokens on protected routes

### File Upload and Certificate Generation Flow

1. Student selects assignment file and submits via frontend
2. Multer middleware handles multipart form data
3. File is stored in `backend/uploads/` directory
4. File URL is saved in Submission record
5. Upon course completion (80% threshold), student requests certificate
6. Backend generates unique certificate ID and stores record
7. Frontend uses jsPDF and html2canvas to render downloadable PDF

### Role-Based Authorization Logic

1. `protect` middleware authenticates the request
2. `authorize` middleware checks if user role matches allowed roles
3. Frontend `ProtectedRoute` component filters routes by user role
4. Dashboard layouts adapt based on current user's role

---

## 3. Tech Stack Breakdown

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI framework with hooks for state and lifecycle |
| TypeScript | Static typing for improved developer experience and error prevention |
| Vite | Fast build tool with hot module replacement for development |
| TailwindCSS | Utility-first CSS framework for rapid styling |
| ShadCN UI (Radix) | Accessible, unstyled component primitives for consistent UI |
| React Query | Server state management with caching, refetching, and synchronization |
| React Router v6 | Client-side routing with nested routes and protected route wrappers |
| Framer Motion | Declarative animations for smooth UI transitions |
| jsPDF + html2canvas | Client-side PDF generation for certificates |
| Axios | HTTP client with interceptors for API requests |
| Socket.io Client | Real-time bidirectional communication for notifications |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime for server-side execution |
| Express | Minimal web framework for REST API routing |
| TypeScript | Type safety across controllers, routes, and middleware |
| Prisma ORM | Type-safe database access with migrations and schema management |
| PostgreSQL | Relational database for structured data storage |
| JWT (jsonwebtoken) | Stateless authentication with access and refresh tokens |
| bcryptjs | Password hashing for secure credential storage |
| Multer | Multipart form handling for file uploads |
| Zod | Schema validation for request payloads |
| Helmet | Security headers middleware |
| Socket.io | Real-time server for push notifications |
| PDFKit | Server-side PDF generation capability |

---

## 4. Folder Structure Explanation

### Backend Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database models and relationships
│   ├── migrations/         # Database migration history
│   └── seedCourses.ts      # Seed script for demo data
├── src/
│   ├── config/             # Database client and Socket.io setup
│   ├── controllers/        # Request handlers with business logic
│   │   ├── authController.ts         # Login, register, logout, me
│   │   ├── courseController.ts       # Course CRUD operations
│   │   ├── assignmentController.ts   # Assignment management
│   │   ├── submissionController.ts   # Student submission handling
│   │   ├── certificateController.ts  # Certificate generation
│   │   ├── enrollmentController.ts   # Course enrollment logic
│   │   ├── adminController.ts        # Admin-specific operations
│   │   ├── instructorController.ts   # Instructor dashboard data
│   │   └── studentController.ts      # Student-specific endpoints
│   ├── middleware/
│   │   ├── auth.ts         # JWT verification and user attachment
│   │   ├── roles.ts        # Role-based access control
│   │   └── upload.ts       # Multer configuration for file uploads
│   ├── routes/             # Express route definitions per domain
│   ├── types/              # TypeScript interfaces and type extensions
│   ├── utils/              # Helper functions
│   └── server.ts           # Express app setup and route mounting
└── uploads/                # Stored assignment submissions and assets
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/             # ShadCN primitives (Button, Card, Dialog, etc.)
│   │   ├── CourseCard.tsx  # Course display with animations
│   │   ├── AssignmentCard.tsx  # Assignment status badges
│   │   ├── MegaMenu.tsx    # Category navigation dropdown
│   │   ├── Navbar.tsx      # Top navigation bar
│   │   └── admin/          # Admin-specific components
│   ├── pages/
│   │   ├── Home.tsx              # Public landing page
│   │   ├── Login.tsx             # Authentication form
│   │   ├── Register.tsx          # Registration form
│   │   ├── CourseDetails.tsx     # Course information display
│   │   ├── student/              # Student dashboard and features
│   │   ├── instructor/           # Instructor course management
│   │   └── admin/                # Admin user and submission management
│   ├── context/
│   │   └── AuthContext.tsx   # Global authentication state provider
│   ├── hooks/
│   │   ├── useCourses.ts     # Course data fetching hooks
│   │   ├── useAssignments.ts # Assignment queries and mutations
│   │   ├── useCertificates.ts # Certificate generation hooks
│   │   └── useSocket.ts      # Socket.io connection hook
│   ├── services/
│   │   ├── api.ts            # Axios instance with base configuration
│   │   └── socket.ts         # Socket.io client setup
│   ├── layouts/
│   │   ├── MainLayout.tsx    # Public pages layout with navbar
│   │   └── DashboardLayout.tsx # Authenticated sidebar layout
│   └── App.tsx               # Route definitions and providers
```

### Frontend-Backend Connection

- Frontend `api.ts` configures Axios to point to `VITE_API_URL` (backend)
- All API calls use relative paths mapped to backend routes
- Cookies are shared via `withCredentials: true` for authentication
- File uploads are posted as FormData and stored in backend's `uploads/` folder
- Static files are served from `/uploads/` with CORS headers

---

## 5. Database and Data Models

### Core Models

| Model | Purpose |
|-------|---------|
| **User** | Stores user credentials, profile, and role (ADMIN, INSTRUCTOR, STUDENT) |
| **Course** | Course metadata including title, description, category, difficulty, instructor reference |
| **Section** | Logical grouping of lessons within a course |
| **Lesson** | Individual learning units with video URLs and optional attachments |
| **Enrollment** | Many-to-many relationship between users and courses |
| **Assignment** | Graded tasks within a course with due dates and max scores |
| **Submission** | Student's submitted work for an assignment with status and grade |
| **AssignmentProgress** | Tracks assignment completion state per user |
| **Progress** | Tracks lesson completion per user |
| **Certificate** | Generated upon course completion with unique certificate ID |
| **Review** | Course ratings and comments from enrolled students |
| **UserSettings** | User preferences for notifications, privacy, and theme |
| **Notification** | System and course-related notifications per user |
| **AdminLog** | Audit trail of administrative actions |

### Key Relationships

- User (1) to Course (N): Instructor creates multiple courses
- User (1) to Enrollment (N): Student enrolls in multiple courses
- Course (1) to Section (N): Course contains ordered sections
- Section (1) to Lesson (N): Section contains ordered lessons
- Course (1) to Assignment (N): Course has multiple assignments
- Assignment (1) to Submission (N): Assignment receives multiple student submissions
- User and Course (1) to Certificate (1): One certificate per user per course

### Data Flow Example

1. **UI Action**: Student clicks "Enroll" on course page
2. **API Request**: POST `/api/enrollments` with courseId
3. **Controller**: Creates Enrollment record linking userId and courseId
4. **Database**: Prisma inserts row in Enrollment table
5. **Response**: Returns enrollment confirmation
6. **Cache Update**: React Query invalidates course queries
7. **UI Update**: Enrollment status changes, dashboard shows new course

---

## 6. Authentication and Authorization Flow

### Login and Registration

1. User submits email and password to `/api/auth/login` or `/api/auth/register`
2. Backend validates input using Zod schemas
3. For registration, password is hashed with bcryptjs before storage
4. For login, stored hash is compared with provided password
5. JWT tokens are generated with user ID and role payload
6. Tokens are set as HTTP-only cookies with appropriate expiration
7. Frontend receives success response and fetches user data via `/api/auth/me`

### JWT Token Strategy

- **Access Token**: Short-lived (15 minutes), used for API authorization
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens
- Tokens stored in HTTP-only cookies prevent XSS attacks
- Token payload includes: `id`, `role`, `iat`, `exp`

### Backend Protected Routes

```
Request → protect middleware → authorize middleware → Controller
```

1. `protect`: Extracts token from cookies or Authorization header
2. `protect`: Verifies JWT signature and expiration
3. `protect`: Fetches user from database, checks if blocked
4. `protect`: Attaches `req.user = { id, role }` for controller access
5. `authorize`: Checks if `req.user.role` is in allowed roles array

### Frontend Protected Routes

```tsx
<ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR']}>
  <ComponentName />
</ProtectedRoute>
```

1. `ProtectedRoute` reads user from `AuthContext`
2. If loading, shows spinner
3. If no user, redirects to `/login`
4. If role not in allowedRoles, redirects to `/`
5. Otherwise, renders children

---

## 7. Core Functionalities by Role

### Student Features

| Feature | Description |
|---------|-------------|
| Course Browsing | View all published courses with filters and search |
| Course Enrollment | Enroll in courses to access content and assignments |
| Assignment Submission | Upload files to complete course assignments |
| Progress Tracking | View completion percentage and assignment status |
| Certificate Download | Generate and download PDF certificate upon 80% completion |
| Settings Management | Update profile, notifications, and privacy preferences |

### Instructor Features

| Feature | Description |
|---------|-------------|
| Course Creation | Build courses with sections, lessons, and video content |
| Assignment Management | Create, edit, and delete assignments with due dates |
| Submission Review | View student submissions, provide grades and feedback |
| Dashboard Analytics | Monitor enrollment counts and submission statistics |
| Course Editing | Update course details, add sections, publish/unpublish |

### Admin Features

| Feature | Description |
|---------|-------------|
| User Management | View all users, block/unblock accounts, change roles |
| Course Oversight | Access and manage all courses across instructors |
| Submission Review | Review and grade submissions for any course |
| Platform Analytics | View system-wide statistics and activity |
| Assignment Creation | Create assignments for any course |

---

## 8. API Design Overview

### Route Structure

All API routes are prefixed with `/api/` and organized by domain:

```
/api/auth/*          - Authentication (login, register, logout, me)
/api/users/*         - User profile and settings
/api/courses/*       - Course CRUD and queries
/api/enrollments/*   - Enrollment management
/api/assignments/*   - Assignment CRUD
/api/submissions/*   - Submission handling
/api/certificates/*  - Certificate generation and verification
/api/instructor/*    - Instructor-specific endpoints
/api/student/*       - Student-specific endpoints
/api/admin/*         - Admin-specific endpoints
/api/reviews/*       - Course reviews
```

### Request-Response Lifecycle

1. Express receives HTTP request
2. Global middleware runs (CORS, Helmet, body parsers, morgan)
3. Route matcher finds handler
4. Route-specific middleware runs (protect, authorize, upload)
5. Controller executes business logic
6. Prisma queries database
7. Controller formats response
8. Response sent with success/error structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Handling

- Controllers throw errors with status codes
- Global error handler catches unhandled exceptions
- Multer errors are caught and formatted
- Development mode includes stack traces
- Production mode returns clean error messages

---

## 9. Project Execution Flow (End-to-End)

### Example: Student Submits Assignment

1. **User Opens Frontend**: Browser loads React app from Vite dev server
2. **Initial Auth Check**: `AuthContext` calls `/api/auth/me` to validate session
3. **Navigation**: User navigates to assignment details page
4. **Data Fetching**: `useAssignments` hook fetches assignment data via React Query
5. **File Selection**: User selects file using file input component
6. **Form Submission**: Frontend posts FormData to `/api/submissions`
7. **Middleware Processing**: `protect` validates JWT, `upload` processes file
8. **Controller Logic**: Creates Submission record with file URL
9. **Database Write**: Prisma inserts into Submission table
10. **Response Return**: Controller sends success response with submission data
11. **Cache Invalidation**: React Query invalidates submissions query
12. **UI Update**: Assignment card shows "Submitted" status badge

---

## 10. Environment Setup and Running the Project

### Backend Environment Variables

```env
PORT=5001
DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5174"
```

### Frontend Environment Variables

```env
VITE_API_URL="http://localhost:5001/api"
VITE_BASE_URL="http://localhost:5001"
```

### Running Locally

**Prerequisites**: Node.js v18+, PostgreSQL v14+

**Backend Setup**:
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npx ts-node prisma/seedCourses.ts  # Optional: seed demo data
npm run dev
```

**Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```

**Access Points**:
- Frontend: http://localhost:5174
- Backend API: http://localhost:5001

### Key Dependencies

**Backend**: express, @prisma/client, jsonwebtoken, bcryptjs, multer, zod, socket.io, helmet

**Frontend**: react, react-router-dom, @tanstack/react-query, axios, tailwindcss, framer-motion, jspdf, html2canvas

---

## 11. Design Decisions and Best Practices

### Why Prisma ORM

- Type-safe database queries with auto-generated TypeScript types
- Declarative schema with migration support
- Intuitive query API reduces boilerplate
- Built-in connection pooling for production

### Why React Query

- Eliminates manual loading/error state management
- Automatic caching reduces redundant API calls
- Background refetching keeps data fresh
- Optimistic updates improve perceived performance

### Why Role-Based Architecture

- Clean separation of concerns per user type
- Middleware-based enforcement at API level
- Frontend route protection prevents unauthorized access
- Scalable pattern for adding new roles

### Scalability Considerations

- Stateless JWT authentication enables horizontal scaling
- Prisma connection pooling handles concurrent database access
- Socket.io supports clustered deployments with adapter
- React Query reduces server load through intelligent caching

---

## 12. Limitations and Future Enhancements

### Current Limitations

- No email verification or password reset functionality
- Certificate PDF generated client-side lacks server-side validation
- Single-file upload per submission
- No payment integration for paid courses
- Limited search and filtering capabilities

### Potential Improvements

- Email notifications for assignment deadlines and grades
- Real-time collaboration features using Socket.io
- Video streaming with progress tracking
- Payment gateway integration for course monetization
- Advanced analytics dashboard with charts
- Mobile application using React Native
- Dark mode toggle with system preference detection
- Social sharing for certificates
- Discussion forums per course
- Quiz and exam functionality with auto-grading
