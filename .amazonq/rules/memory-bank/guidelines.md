# Development Guidelines & Standards

## Code Quality Standards

### TypeScript Usage
- **Strict Type Safety**: All files use TypeScript with strict mode enabled
- **Interface Definitions**: Define clear interfaces for data structures (User, Course, Assignment, etc.)
- **Type Annotations**: Explicit typing for function parameters and return values
- **Generic Types**: Use generics for reusable components and API responses
- **Enum Usage**: Use enums for role definitions (STUDENT, INSTRUCTOR, ADMIN)

### Import Organization
- **Grouped Imports**: Organize imports in logical groups (external libraries, internal modules, types)
- **Absolute Paths**: Use absolute imports with @ prefix for clean import paths
- **Named Exports**: Prefer named exports over default exports for better tree-shaking

### Error Handling Patterns
- **Consistent Error Structure**: All API responses follow `{ success: boolean, message: string, data?: any }` format
- **Try-Catch Blocks**: Wrap async operations in try-catch with meaningful error messages
- **HTTP Status Codes**: Use appropriate status codes (200, 201, 400, 401, 404, 500)
- **Error Propagation**: Pass error details to frontend for user feedback

## Backend Development Standards

### Controller Architecture
- **Single Responsibility**: Each controller handles one domain (auth, courses, users, etc.)
- **Async/Await**: Use async/await pattern consistently for database operations
- **Request Validation**: Validate request parameters and body data
- **Response Formatting**: Standardized JSON response structure across all endpoints

### Database Patterns
- **Prisma ORM**: Use Prisma for all database operations with type safety
- **Include Relations**: Use `include` to fetch related data in single queries
- **Select Optimization**: Use `select` to limit returned fields for performance
- **Count Aggregations**: Use `_count` for relationship counting without fetching data

### Authentication & Authorization
- **JWT Implementation**: Use JWT tokens with refresh token rotation
- **Middleware Protection**: Apply `protect` middleware to secured routes
- **Role-Based Access**: Implement role checking for admin/instructor/student operations
- **Password Security**: Hash passwords with bcrypt (salt rounds: 10)

### API Route Organization
- **RESTful Design**: Follow REST conventions for endpoint naming
- **Route Grouping**: Group related routes by feature/domain
- **Middleware Chain**: Apply authentication, validation, and error handling middleware
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)

## Frontend Development Standards

### React Component Patterns
- **Functional Components**: Use function components with hooks exclusively
- **Custom Hooks**: Extract business logic into reusable custom hooks
- **Component Composition**: Build complex UIs through component composition
- **Props Interface**: Define TypeScript interfaces for component props

### State Management
- **React Query**: Use TanStack React Query for server state management
- **Local State**: Use useState for component-specific state
- **Context API**: Use React Context for global state (authentication)
- **State Colocation**: Keep state as close to where it's used as possible

### UI Component Standards
- **ShadCN UI**: Use ShadCN UI components as base building blocks
- **Consistent Styling**: Apply Tailwind CSS classes consistently
- **Responsive Design**: Implement mobile-first responsive layouts
- **Accessibility**: Include proper ARIA labels and keyboard navigation

### Data Fetching Patterns
- **React Query Hooks**: Use useQuery for data fetching, useMutation for updates
- **Loading States**: Implement loading indicators for async operations
- **Error Boundaries**: Handle errors gracefully with user-friendly messages
- **Cache Management**: Leverage React Query's caching and invalidation

## Code Formatting & Style

### Naming Conventions
- **camelCase**: Use camelCase for variables, functions, and methods
- **PascalCase**: Use PascalCase for components, interfaces, and types
- **UPPER_CASE**: Use UPPER_CASE for constants and environment variables
- **Descriptive Names**: Use clear, descriptive names that explain purpose

### File Organization
- **Feature-Based Structure**: Organize files by feature rather than file type
- **Index Files**: Use index.ts files for clean imports
- **Consistent Extensions**: Use .ts for TypeScript files, .tsx for React components
- **Barrel Exports**: Group related exports in index files

### Code Documentation
- **JSDoc Comments**: Document complex functions and business logic
- **Inline Comments**: Explain non-obvious code sections
- **README Files**: Maintain comprehensive documentation
- **Type Definitions**: Use descriptive type names and interfaces

## Security Best Practices

### Input Validation
- **Zod Schemas**: Use Zod for runtime type validation
- **Sanitization**: Sanitize user inputs to prevent injection attacks
- **File Upload Security**: Validate file types and sizes for uploads
- **CORS Configuration**: Properly configure CORS for cross-origin requests

### Authentication Security
- **Token Expiration**: Implement short-lived access tokens with refresh tokens
- **Secure Headers**: Use Helmet.js for security headers
- **Password Policies**: Enforce strong password requirements
- **Session Management**: Implement proper session handling and cleanup

## Performance Optimization

### Database Optimization
- **Query Efficiency**: Use select and include strategically to minimize data transfer
- **Connection Pooling**: Leverage Prisma's connection pooling
- **Indexing**: Ensure proper database indexing for frequently queried fields
- **Pagination**: Implement pagination for large data sets

### Frontend Optimization
- **Code Splitting**: Use React.lazy for route-based code splitting
- **Memoization**: Use React.memo and useMemo for expensive computations
- **Bundle Optimization**: Optimize bundle size with proper imports
- **Image Optimization**: Use appropriate image formats and sizes

## Testing Guidelines

### Backend Testing
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database interactions
- **Error Scenarios**: Test error handling and edge cases
- **Mock Data**: Use consistent mock data for testing

### Frontend Testing
- **Component Testing**: Test component rendering and user interactions
- **Hook Testing**: Test custom hooks in isolation
- **API Integration**: Test API integration with mock responses
- **User Workflows**: Test complete user workflows end-to-end

## Development Workflow

### Git Practices
- **Feature Branches**: Use feature branches for new development
- **Commit Messages**: Write clear, descriptive commit messages
- **Code Reviews**: Require code reviews before merging
- **Branch Protection**: Protect main branch from direct pushes

### Environment Management
- **Environment Variables**: Use .env files for configuration
- **Development/Production**: Maintain separate configurations for different environments
- **Secret Management**: Never commit secrets or API keys
- **Configuration Validation**: Validate required environment variables on startup

## Common Patterns & Idioms

### API Response Pattern
```typescript
// Consistent API response structure
{
  success: boolean,
  message?: string,
  data?: any,
  error?: string
}
```

### React Query Pattern
```typescript
// Standard data fetching with React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => api.get(`/resource/${id}`)
});
```

### Error Handling Pattern
```typescript
// Consistent error handling in controllers
try {
  // Operation
  res.json({ success: true, data: result });
} catch (error: any) {
  res.status(500).json({
    success: false,
    message: error.message || 'Operation failed'
  });
}
```

### Component Props Pattern
```typescript
// Clear interface definitions for components
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}
```

These guidelines ensure consistent, maintainable, and scalable code across the entire Learning Management System platform.