# Technology Stack & Development Setup

## Programming Languages & Versions

### Backend
- **TypeScript**: ^5.3.3 - Type-safe JavaScript with modern ES features
- **Node.js**: v18+ required - JavaScript runtime environment
- **SQL**: PostgreSQL dialect for database queries

### Frontend
- **TypeScript**: ^5.2.2 - Strongly typed React development
- **JavaScript**: ES2022+ features with Vite bundling
- **CSS**: Modern CSS with Tailwind utility classes

## Core Technologies

### Backend Stack
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs hashing
- **File Upload**: Multer middleware
- **Validation**: Zod schema validation
- **Real-time**: Socket.io for WebSocket connections
- **PDF Generation**: PDFKit for certificate creation

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: ShadCN UI components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack React Query for server state
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router v6 for client-side navigation
- **PDF Export**: jsPDF + html2canvas for certificate downloads

## Build Systems & Tools

### Backend Development
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Frontend Development
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

### Development Tools
- **tsx**: TypeScript execution for development
- **ts-node**: TypeScript execution for scripts
- **Vite**: Fast build tool with HMR
- **ESLint**: Code linting and formatting
- **Prisma CLI**: Database management and migrations

## Dependencies

### Backend Core Dependencies
```json
{
  "@prisma/client": "^5.10.2",
  "express": "^4.18.2",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.5",
  "zod": "^3.22.4",
  "pdfkit": "^0.15.0"
}
```

### Frontend Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.1",
  "@tanstack/react-query": "^5.24.1",
  "axios": "^1.6.7",
  "framer-motion": "^12.23.24",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.344.0"
}
```

### UI Component Libraries
```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.1"
}
```

## Development Commands

### Backend Commands
```bash
# Development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production server
npm start

# Database operations
npx prisma migrate dev
npx prisma generate
npx prisma studio

# Seed database with courses
npx ts-node prisma/seedCourses.ts
```

### Frontend Commands
```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

## Environment Configuration

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

## Database Technology

### PostgreSQL Setup
- **Version**: v14 or higher required
- **ORM**: Prisma for type-safe database access
- **Migrations**: Version-controlled schema changes
- **Connection**: Connection pooling with Prisma Client

### Prisma Configuration
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Build & Deployment

### TypeScript Configuration
- **Backend**: CommonJS modules with Node.js target
- **Frontend**: ES modules with DOM libraries
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: Configured for clean imports

### Vite Configuration
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})
```

### PostCSS & Tailwind
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Development Workflow

### Local Development Setup
1. **Prerequisites**: Node.js v18+, PostgreSQL v14+
2. **Database**: Create PostgreSQL database
3. **Backend**: Install dependencies, configure .env, run migrations
4. **Frontend**: Install dependencies, configure .env
5. **Development**: Run both servers concurrently

### Code Quality Tools
- **TypeScript**: Compile-time type checking
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (configurable)
- **Prisma**: Database schema validation

### Testing Strategy
- **Manual Testing**: Comprehensive user workflow testing
- **Type Safety**: TypeScript compilation as first-line testing
- **Database**: Prisma schema validation
- **API**: Zod schema validation for request/response

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: React.lazy for route-based splitting
- **Bundle Optimization**: Vite's optimized bundling
- **Image Optimization**: Responsive images with proper formats
- **Caching**: React Query for intelligent data caching

### Backend Optimizations
- **Database**: Prisma query optimization and connection pooling
- **Middleware**: Efficient request processing pipeline
- **Static Files**: Express static middleware for file serving
- **Compression**: Ready for gzip compression in production