# Project Structure & Architecture

## Directory Organization

### Root Structure
```
TASK-4/
├── backend/          # Node.js + Express API server
├── frontend/         # React + TypeScript client
├── .amazonq/         # Amazon Q configuration and rules
└── README.md         # Project documentation
```

## Backend Architecture (`/backend`)

### Core Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers and business logic
│   ├── routes/         # API endpoint definitions
│   ├── middleware/     # Authentication, authorization, file upload
│   ├── config/         # Database and external service configuration
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions and helpers
├── prisma/             # Database schema and migrations
├── uploads/            # File storage for user uploads
└── package.json        # Dependencies and scripts
```

### Controller Layer
- **adminController.ts**: Platform administration and user management
- **authController.ts**: Authentication, registration, and session management
- **courseController.ts**: Course CRUD operations and content management
- **assignmentController.ts**: Assignment creation and management
- **submissionController.ts**: Student submission handling and grading
- **certificateController.ts**: Certificate generation and verification
- **settingsController.ts**: User preferences and account settings
- **progressController.ts**: Learning progress tracking and analytics

### Route Organization
- **Role-based routing**: Separate route files for admin, instructor, and student operations
- **Feature-based grouping**: Routes organized by functional domains (courses, assignments, etc.)
- **Nested routing**: Student-specific routes under `/student` subdirectory
- **Middleware integration**: Protected routes with authentication and role verification

### Database Layer
- **Prisma ORM**: Type-safe database access with auto-generated client
- **Migration system**: Version-controlled schema changes
- **Seed data**: Professional course content with realistic test data
- **Relational design**: Normalized schema with proper foreign key relationships

## Frontend Architecture (`/frontend`)

### Core Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based page components
│   ├── layouts/        # Layout wrappers and templates
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API communication layer
│   ├── lib/            # Utility libraries and configurations
│   └── utils/          # Helper functions
└── package.json        # Dependencies and build configuration
```

### Component Architecture

#### UI Components (`/components/ui`)
- **ShadCN UI Integration**: Pre-built, accessible components
- **Consistent Design System**: Unified styling with Tailwind CSS
- **Reusable Primitives**: Button, Input, Dialog, Toast, etc.
- **Custom Hooks**: `use-toast.ts` for notification management

#### Feature Components
- **CourseCard.tsx**: Course display with enrollment and progress
- **AssignmentCard.tsx**: Assignment overview with status indicators
- **MegaMenu.tsx**: Category-based navigation dropdown
- **Navbar.tsx**: Main navigation with user authentication state

#### Role-Specific Components
- **Admin Components**: User management, course oversight, analytics
- **Instructor Components**: Course builder, assignment creation, grading tools
- **Student Components**: Course enrollment, assignment submission, progress tracking

### Page Organization

#### Role-Based Pages
```
pages/
├── admin/              # Administrative interfaces
│   ├── Dashboard.tsx   # Admin overview and analytics
│   ├── UserManagement.tsx  # User administration
│   └── CourseManager.tsx   # Course oversight
├── instructor/         # Instructor tools
│   ├── CourseBuilder.tsx   # Course creation interface
│   └── SubmissionReview.tsx # Grading interface
└── student/            # Student learning interface
    ├── Dashboard.tsx   # Student progress overview
    └── AssignmentDetails.tsx # Assignment submission
```

#### Shared Pages
- **Home.tsx**: Landing page with course discovery
- **CourseDetails.tsx**: Detailed course information and enrollment
- **Login.tsx / Register.tsx**: Authentication interfaces

### State Management
- **React Query**: Server state management and caching
- **React Context**: Authentication state and user session
- **Local State**: Component-specific state with React hooks

## Architectural Patterns

### Backend Patterns
- **MVC Architecture**: Clear separation of concerns with controllers, routes, and models
- **Middleware Pipeline**: Request processing through authentication, validation, and error handling
- **Repository Pattern**: Database access abstraction through Prisma ORM
- **JWT Authentication**: Stateless authentication with refresh token rotation

### Frontend Patterns
- **Component Composition**: Reusable components with prop-based customization
- **Custom Hooks**: Business logic extraction into reusable hooks
- **Layout System**: Consistent page structure with role-based layouts
- **Error Boundaries**: Graceful error handling and user feedback

### Data Flow
1. **Client Request**: Frontend initiates API call through service layer
2. **Route Handling**: Express router directs to appropriate controller
3. **Authentication**: Middleware validates JWT and user permissions
4. **Business Logic**: Controller processes request and interacts with database
5. **Response**: Structured JSON response with error handling
6. **Client Update**: React Query manages cache updates and UI re-rendering

## Integration Points

### Database Integration
- **Prisma Client**: Type-safe database queries with auto-completion
- **Migration System**: Automated schema updates and version control
- **Connection Pooling**: Efficient database connection management

### File Storage
- **Multer Integration**: File upload handling for assignments and course materials
- **Local Storage**: File system storage with organized directory structure
- **Static Serving**: Express static middleware for file access

### Real-Time Features
- **Socket.io**: WebSocket connections for live updates
- **Event-Driven**: Real-time notifications for submissions and grades

### External Services
- **PDF Generation**: Certificate creation with PDFKit
- **Email Integration**: Ready for SMTP integration (future enhancement)

## Security Architecture
- **Authentication**: JWT-based with secure token storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schema validation on all endpoints
- **File Security**: Upload restrictions and file type validation
- **CORS Configuration**: Cross-origin request security
- **Helmet Integration**: Security headers and protection middleware