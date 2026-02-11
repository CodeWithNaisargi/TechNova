# Common Development Prompts

## Code Generation

### Add New API Endpoint
```
Create a new API endpoint in the backend for [feature name].
- Route: /api/[resource]
- Method: [GET/POST/PUT/DELETE]
- Authentication: Required
- Role: [STUDENT/INSTRUCTOR/ADMIN]
- Response format: { success: boolean, data?: any, message?: string }
```

### Create React Component
```
Create a new React component for [feature name].
- Use TypeScript with proper interface definitions
- Follow ShadCN UI patterns
- Include loading and error states
- Use React Query for data fetching
- Apply Tailwind CSS for styling
```

### Add Database Model
```
Add a new Prisma model for [entity name].
- Include proper relations to existing models
- Add timestamps (createdAt, updatedAt)
- Follow existing naming conventions
- Generate migration after schema update
```

## Code Review

### Review Recommendation Logic
```
Review the recommendation service in backend/src/services/recommendationService.ts
- Check cosine similarity implementation
- Verify feature vector calculations
- Ensure cold-start handling works
- Validate skill inference logic
```

### Review Authentication Flow
```
Review the authentication implementation:
- JWT token generation and validation
- Refresh token rotation
- Email verification flow
- Password hashing security
```

## Debugging

### Fix CORS Issues
```
Debug CORS configuration in backend/src/server.ts
- Check allowed origins
- Verify credentials handling
- Test with frontend on port 5174
```

### Debug Onboarding Navigation
```
Fix navigation loop in student onboarding flow:
- Check React Query cache invalidation
- Verify user state updates
- Test education → career → dashboard flow
```

## Testing

### Test Recommendation Engine
```
Create test cases for the recommendation service:
- Test with new user (no skills)
- Test with user having multiple skills
- Test domain-specific recommendations
- Verify cosine similarity calculations
```

### Test Authentication
```
Test authentication endpoints:
- Registration with email verification
- Login with valid/invalid credentials
- Token refresh flow
- Protected route access
```

## Documentation

### Document API Endpoints
```
Generate API documentation for [controller name]:
- List all endpoints with methods
- Document request/response schemas
- Include authentication requirements
- Add example requests/responses
```

### Update README
```
Update README.md with:
- New feature descriptions
- Updated setup instructions
- Additional environment variables
- New test credentials
```
