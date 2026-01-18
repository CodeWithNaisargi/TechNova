# 🎓 SkillOrbit - Career-Centric Learning Management System

> **Hackathon Project** | AI-Powered Career Guidance & Skill-Based Learning Platform

![SkillOrbit Banner](https://via.placeholder.com/1200x400/2563EB/FFFFFF?text=SkillOrbit+-+Learn.+Grow.+Achieve.)

---

## 📋 Table of Contents

- [Selected Problem Statement](#-selected-problem-statement)
- [Team's Ideation & Approach](#-teams-ideation--approach)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Workflow](#-architecture--workflow)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [How to Run Locally](#-how-to-run-locally)
- [Test Login Credentials](#-test-login-credentials)
- [Challenges Faced](#-challenges-faced)
- [Future Scope](#-future-scope)
- [Code Snippets](#-code-snippets)
- [Referenced Repositories](#-referenced-repositories)
- [Security & Error Handling](#-security--error-handling)

---

## 🎯 Selected Problem Statement

**Problem**: Traditional LMS platforms focus on generic course delivery without considering:
- Student's **educational background**
- **Career aspirations** and skill gaps
- **Domain-specific learning paths** (Agriculture, Healthcare, Urban Tech)
- Personalized recommendations based on progress

**Our Solution**: SkillOrbit bridges this gap by creating a **career-centric learning ecosystem** that:
- Matches courses to education level (Secondary → Postgraduate)
- Recommends courses based on career path selection
- Infers skills from course/assignment completion
- Uses **content-based filtering with cosine similarity** for intelligent recommendations

---

## 💡 Team's Ideation & Approach

### Ideation Process
1. **Research**: Analyzed government skill development programs (PMKVY, Digital India)
2. **User Personas**: Defined 3 user types - Students, Instructors, Admins
3. **Domain Focus**: Selected Agriculture, Healthcare, and Urban Technology as key sectors
4. **Technical Design**: Chose feature-vector based recommendations over ML for reliability

### Approach
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Onboarding    │ ──► │  Career Matching │ ──► │  Personalized   │
│  Education +    │     │  Skill Mapping   │     │  Recommendations│
│  Career Path    │     │  Progress Track  │     │  Dashboard      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**Key Decisions**:
- Separate onboarding flow from dashboard for clean UX
- Domain-aligned instructors (9 experts, 3 per domain)
- Real-time skill inference on course completion
- Content-based recommendation (NOT ML-powered) for transparency

---

## 📖 Project Overview

SkillOrbit is a **production-grade Learning Management System** designed for domain-specific education across:

| Domain | Focus Areas |
|--------|-------------|
| 🌾 **Agriculture Technology** | IoT Sensors, Drones, Smart Farming, Supply Chain |
| 🏥 **Healthcare Technology** | EMR/EHR, Telemedicine, Medical AI, Wearables |
| 🏙️ **Urban Technology** | Smart Traffic, Water Management, Smart Grid, GIS |

### Key Metrics
- **30 Domain Courses** (10 per domain)
- **~270 Assignments** (8-10 per course)
- **20 Skills** mapped to courses
- **64 CourseSkill Mappings** for recommendations
- **9 Domain-Expert Instructors**

---

## ✨ Features

### 🔐 Authentication & Authorization
- [x] Email/Password Registration with Role Selection
- [x] JWT-based Authentication (Access + Refresh Tokens)
- [x] Email Verification with Token Expiry
- [x] Role-Based Access Control (Student, Instructor, Admin)
- [x] Protected Routes with Dashboard Guard

### 🎓 Student Features
- [x] Education Level Selection (Secondary → Postgraduate)
- [x] Career Path Selection (Frontend Dev, Healthcare Analyst, Smart City Planner)
- [x] Personalized Course Recommendations
- [x] Progress Tracking with Visual Indicators
- [x] Assignment Submission & Grading
- [x] Certificate Generation (on 100% completion)
- [x] Skill Inference from Completed Courses

### 👨‍🏫 Instructor Features
- [x] Course Creation & Management
- [x] Assignment Creation with Due Dates
- [x] Student Submission Review
- [x] Analytics Dashboard

### 👑 Admin Features
- [x] User Management (Block/Unblock)
- [x] Course Approval
- [x] System-wide Analytics
- [x] Submission Oversight

### 🧠 Recommendation Engine
- [x] Content-Based Filtering
- [x] Cosine Similarity Matching
- [x] Feature Vectors (Education + Skills + Domain)
- [x] Next Focus Skill Suggestion
- [x] Cold-Start Handling for New Users

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| React Router v6 | Client-Side Routing |
| TanStack Query | Server State Management |
| Tailwind CSS | Styling |
| Shadcn/UI | UI Components |
| Framer Motion | Animations |
| Lucide React | Icons |
| Socket.io Client | Real-Time Updates |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| TypeScript | Type Safety |
| Prisma ORM | Database Access |
| PostgreSQL | Database |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Nodemailer | Email Service |
| Socket.io | Real-Time Communication |
| Multer | File Uploads |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Git | Version Control |
| MailHog | Email Testing (Dev) |
| Prisma Studio | Database GUI |

---

## 🏗️ Architecture & Workflow

### System Architecture
```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   Auth      │  │  Dashboard  │  │  Courses    │               │
│  │   Context   │  │  Components │  │  Components │               │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │ Auth Routes │  │ Course      │  │ Recommendation Service  │   │
│  │ /api/auth/* │  │ Routes      │  │ Cosine Similarity       │   │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘   │
└─────────┼────────────────┼─────────────────────┼─────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Prisma + PostgreSQL)               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────────┐  │
│  │  Users  │  │ Courses │  │ Skills  │  │ CourseSkill Mapping │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### User Flow
```
            ┌───────────────┐
            │   Register    │
            └───────┬───────┘
                    ▼
            ┌───────────────┐
            │ Verify Email  │
            └───────┬───────┘
                    ▼
            ┌───────────────┐
            │    Login      │
            └───────┬───────┘
                    ▼
    ┌───────────────────────────────┐
    │   STUDENT ONBOARDING FLOW     │
    │  ┌─────────────────────────┐  │
    │  │ Select Education Level  │  │
    │  │ (Secondary → Postgrad)  │  │
    │  └───────────┬─────────────┘  │
    │              ▼                │
    │  ┌─────────────────────────┐  │
    │  │  Select Career Path     │  │
    │  │  (Frontend/Health/Urban)│  │
    │  └─────────────────────────┘  │
    └───────────────┬───────────────┘
                    ▼
            ┌───────────────┐
            │   Dashboard   │
            │ (With Sidebar)│
            └───────────────┘
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+ 
- **PostgreSQL** v14+
- **npm** or **yarn**
- **Git**

### Clone Repository
```bash
git clone https://github.com/CodeWithNaisargi/ingenious-hackathon-project.git
cd ingenious-hackathon-project
```

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackathon-project"

# JWT Secrets
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key"

# Server
PORT=5001
FRONTEND_URL=http://localhost:5174

# Email (MailHog for development)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@skillorbit.com
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:5001/api"
VITE_BASE_URL="http://localhost:5001"
```

> ⚠️ **Note**: These are example values. Never commit real secrets to the repository.

---

## ▶️ How to Run Locally

### Step 1: Setup Database
```bash
# Start PostgreSQL (if not running)
# Create database
createdb hackathon-project

# Navigate to backend
cd backend

# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed the database
npx tsx prisma/seedCourses.ts
npx tsx prisma/seedCareerPaths.ts
```

### Step 2: Start MailHog (for email testing)
```bash
# Install MailHog (Windows - download from GitHub releases)
# Or use Docker:
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Access MailHog UI at: http://localhost:8025
```

### Step 3: Start Backend
```bash
cd backend
npm run dev

# Server runs at: http://localhost:5001
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev

# App runs at: http://localhost:5174
```

### Quick Start (Copy-Paste)
```bash
# Terminal 1 - Backend
cd backend && npm install && npx prisma db push && npx tsx prisma/seedCourses.ts && npx tsx prisma/seedCareerPaths.ts && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

---

## 🔑 Test Login Credentials

After running the seed scripts, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@lms.com | admin123 |
| **Student 1** | student1@lms.com | student123 |
| **Student 2** | student2@lms.com | student123 |
| **Student 3** | student3@lms.com | student123 |
| **Instructor (Agri)** | dr.priya.sharma@lms.com | instructor123 |
| **Instructor (Health)** | dr.vikram.mehta@lms.com | instructor123 |
| **Instructor (Urban)** | dr.meera.iyer@lms.com | instructor123 |

> All seeded users have `isEmailVerified: true` - no email verification needed for testing.

---

## 🚧 Challenges Faced

### 1. Email Verification Flow
**Challenge**: Verification links broke on double-click/refresh
**Solution**: Modified `verifyEmail` to handle already-verified users gracefully without clearing the token immediately

### 2. Onboarding Navigation Loop
**Challenge**: After career selection, users were redirected back to education page
**Solution**: Added React Query cache invalidation (`queryClient.invalidateQueries`) before navigation to ensure fresh user data

### 3. CORS Issues
**Challenge**: Frontend running on different ports during development
**Solution**: Configured multi-origin CORS in backend to allow ports 5174, 5175, 5176

### 4. Recommendation Cold-Start
**Challenge**: New users with no skills got poor recommendations
**Solution**: Used career path domain + education level as fallback features in the vector

### 5. Merge Conflicts
**Challenge**: Git conflicts between team branches
**Solution**: Established clear file ownership and used structured merge strategy

---

## 🔮 Future Scope

### Near-Term Enhancements
- [ ] **Redis Caching** for recommendation results
- [ ] **Payment Integration** (Razorpay/Stripe) for paid courses
- [ ] **Video Content Hosting** with HLS streaming
- [ ] **Mobile App** (React Native)

### Long-Term Vision
- [ ] **Collaborative Learning** - Study groups and forums
- [ ] **Gamification** - Badges, leaderboards, streaks
- [ ] **AI Chatbot** - Course-specific Q&A assistant
- [ ] **Employer Dashboard** - Verified skill credentials
- [ ] **Multi-language Support** - Hindi, Tamil, etc.
- [ ] **Offline Mode** - Download courses for offline learning

### Scalability Plan
- Microservices architecture for recommendation engine
- CDN integration for static assets
- Database read replicas for high traffic

---

## 💻 Code Snippets

### 1. Cosine Similarity (Recommendation Engine)
```typescript
// backend/src/services/recommendationService.ts
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
}
```

### 2. Dashboard Guard (Protected Routes)
```typescript
// frontend/src/App.tsx
const DashboardGuard = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    // Students must complete onboarding
    if (user.role === 'STUDENT') {
        if (!user.educationLevel) {
            return <Navigate to="/onboarding/education" replace />;
        }
        if (!user.interestedCareerPath) {
            return <Navigate to="/onboarding/career" replace />;
        }
    }

    return <>{children}</>;
};
```

### 3. Skill Inference on Course Completion
```typescript
// backend/src/controllers/progressController.ts
if (percentage === 100) {
    // Generate certificate
    await prisma.certificate.upsert({...});
    
    // Infer skills from course completion
    await inferSkillsFromCourseCompletion(userId, courseId);
    console.log(`🧠 Skills inferred for user ${userId}`);
}
```

### 4. Student Feature Vector
```typescript
// backend/src/services/recommendationService.ts
export async function getStudentVector(userId: string): Promise<number[]> {
    const user = await prisma.user.findUnique({...});
    
    // Education level (normalized 0-1)
    const educationScore = user.educationLevel
        ? EDUCATION_ENCODING[user.educationLevel] / 5 : 0.5;

    // Skill scores (0-1 for each core skill)
    const skillScores = CORE_SKILLS.map(skillName => {
        const userSkill = user.userSkills.find(...);
        return userSkill ? userSkill.level / 100 : 0;
    });

    // Career domain preference
    const domainScore = user.interestedCareerPath?.domain
        ? DOMAIN_ENCODING[user.interestedCareerPath.domain] / 4 : 0.5;

    return [educationScore, ...skillScores, projectScore, domainScore];
}
```

---

## 📚 Referenced Repositories

| Repository | Purpose |
|------------|---------|
| [Shadcn/UI](https://github.com/shadcn-ui/ui) | UI Component Library |
| [Prisma](https://github.com/prisma/prisma) | ORM & Database Toolkit |
| [TanStack Query](https://github.com/TanStack/query) | Server State Management |
| [Socket.io](https://github.com/socketio/socket.io) | Real-Time Communication |
| [Framer Motion](https://github.com/framer/motion) | Animation Library |

---

## 🔒 Security & Error Handling

### Security Measures
- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: Short-lived access tokens (15 min), refresh tokens (7 days)
- ✅ **HttpOnly Cookies**: Tokens stored securely
- ✅ **CORS Configuration**: Whitelist of allowed origins
- ✅ **Input Validation**: Server-side validation on all inputs
- ✅ **Role-Based Access**: Protected routes by user role

### Error Handling
- Global error handler middleware in Express
- React Error Boundaries for component failures
- Toast notifications for user-facing errors
- Console logging for debugging (dev only)

### Secrets Confirmation
> ⚠️ **CONFIRMED**: No secrets, API keys, or sensitive credentials are committed to this repository.
> 
> All sensitive values are loaded via environment variables from `.env` files which are in `.gitignore`.

---

## 👥 Team

| Name | Role |
|------|------|
| Naisargi | Full-Stack Developer |
| Team Member 2 | Frontend Developer |
| Team Member 3 | Backend Developer |

---

## 📄 License

This project was developed for the **Ingenious Hackathon 2026**.

---

<p align="center">Made with ❤️ for the Ingenious Hackathon</p>
