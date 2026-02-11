# SkillOrbit LMS - Agent Context

## Project Overview
Career-centric Learning Management System with personalized course recommendations based on education level, career paths, and skill development.

## Key Architecture Decisions
- **Monorepo Structure**: Separate backend and frontend directories
- **Type Safety**: TypeScript across entire stack
- **Database**: PostgreSQL with Prisma ORM for type-safe queries
- **Authentication**: JWT with refresh token rotation
- **Recommendations**: Content-based filtering using cosine similarity (NOT ML)

## Code Patterns to Follow
- Use async/await for all database operations
- Implement try-catch blocks with standardized error responses
- Follow REST conventions for API endpoints
- Use React Query for server state management
- Apply role-based access control on all protected routes

## Domain Context
- **Agriculture Tech**: IoT sensors, drones, smart farming
- **Healthcare Tech**: EMR/EHR, telemedicine, medical AI
- **Urban Tech**: Smart traffic, water management, GIS

## Important Files
- `backend/src/services/recommendationService.ts` - Core recommendation logic
- `backend/prisma/schema.prisma` - Database schema
- `frontend/src/context/AuthContext.tsx` - Authentication state
- `frontend/src/App.tsx` - Routing and dashboard guards

## Testing Credentials
- Admin: admin@lms.com / admin123
- Student: student1@lms.com / student123
- Instructor: dr.priya.sharma@lms.com / instructor123

## Development Commands
Backend: `cd backend && npm run dev`
Frontend: `cd frontend && npm run dev`
Database: `npx prisma studio`
