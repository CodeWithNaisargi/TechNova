# Project Dependencies

## Backend Dependencies

### Core
- express: ^4.18.2 - Web framework
- @prisma/client: ^5.10.2 - Database ORM
- typescript: ^5.3.3 - Type safety
- bcryptjs: ^2.4.3 - Password hashing
- jsonwebtoken: ^9.0.2 - JWT authentication

### Middleware & Utilities
- cors: ^2.8.5 - Cross-origin requests
- helmet: ^7.1.0 - Security headers
- multer: ^1.4.5-lts.1 - File uploads
- socket.io: ^4.7.5 - Real-time communication
- zod: ^3.22.4 - Schema validation
- nodemailer: ^6.9.9 - Email service

### Development
- tsx: ^4.7.1 - TypeScript execution
- ts-node: ^10.9.2 - Script execution
- prisma: ^5.10.2 - Database CLI

## Frontend Dependencies

### Core
- react: ^18.2.0 - UI framework
- react-dom: ^18.2.0 - React rendering
- typescript: ^5.2.2 - Type safety
- vite: ^5.1.0 - Build tool

### Routing & State
- react-router-dom: ^6.22.1 - Client routing
- @tanstack/react-query: ^5.24.1 - Server state
- axios: ^1.6.7 - HTTP client

### UI & Styling
- tailwindcss: ^3.4.1 - Utility CSS
- framer-motion: ^12.23.24 - Animations
- lucide-react: ^0.344.0 - Icons
- @radix-ui/react-*: Various - UI primitives

### Utilities
- clsx: ^2.1.0 - Class names
- tailwind-merge: ^2.2.1 - Tailwind utilities
- jspdf: ^2.5.2 - PDF generation
- html2canvas: ^1.4.1 - HTML to canvas

## Update Strategy
- Check for security updates weekly
- Update minor versions monthly
- Test thoroughly before major version updates
- Keep Prisma and @prisma/client in sync

## Known Compatibility Issues
- None currently identified

## Deprecated Packages
- None currently in use
