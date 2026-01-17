- ✅ Monitor platform analytics
- ✅ Full administrative control

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **File Upload**: Multer
- **Validation**: Zod

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: ShadCN UI + TailwindCSS
- **State Management**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF + html2canvas
- **Routing**: React Router v6

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- pgAdmin (optional, for database management)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TASK-4
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
PORT=5001
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lms_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5174"

# Create database
# In PostgreSQL, create a database named 'lms_db'

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database with 10 professional courses
npx ts-node prisma/seedCourses.ts
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
VITE_API_URL="http://localhost:5001/api"
VITE_BASE_URL="http://localhost:5001"
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5001`

### Start Frontend Application
```bash
cd frontend
npm run dev
```
App runs on: `http://localhost:5174`

## 👤 Test Accounts

After seeding, use these accounts to test:

### Admin Account
- **Email**: `admin@lms.com`
- **Password**: `admin123`
- **Access**: Full platform control

### Instructor Account
- **Email**: `john.doe@lms.com`
- **Password**: `instructor123`
- **Access**: Create courses, manage assignments

### Student Account
- **Email**: `student1@lms.com`
- **Password**: `student123`
- **Access**: Enroll, submit assignments, earn certificates

## 📚 Available Courses (Seeded)

1. **Complete React Developer Course 2024** (Intermediate)
2. **Node.js & Express - Backend Development** (Intermediate)
3. **MERN Stack - Full Stack Development** (Advanced)
4. **Python Programming** (Beginner)
5. **Java Programming** (Intermediate)
6. **Data Science & Machine Learning** (Advanced)
7. **Modern Web Design** (Beginner)
8. **UI/UX Design Masterclass** (Intermediate)
9. **Android App Development** (Intermediate)
10. **Cloud Computing with AWS** (Advanced)

Each course includes:
- 10 assignments
- 5 reviews
- Professional thumbnails
- Detailed descriptions

## 🎯 Key Workflows

### Student Workflow
1. Register/Login
2. Browse courses on homepage
3. Enroll in a course
4. View course assignments
5. Complete and submit assignments
6. Receive grades and feedback
7. Generate certificate (80% completion required)
8. Download certificate as PDF

### Instructor Workflow
1. Login as instructor
2. Create new course
3. Add sections and lessons
4. Create assignments with due dates
5. Review student submissions
6. Provide grades and feedback

### Admin Workflow
1. Login as admin
2. Manage all courses
3. Review all submissions
4. Approve/reject submissions
5. Monitor platform analytics

## 📁 Project Structure

```
TASK-4/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, roles, upload
│   │   ├── config/           # Database config
│   │   └── types/            # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seedCourses.ts    # Seed data
│   └── uploads/              # Uploaded files
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout components
│   │   ├── context/          # React context
│   │   └── services/         # API services
│   └── public/               # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/popular` - Get popular courses
- `GET /api/courses/new` - Get new courses
- `GET /api/courses/categories` - Get categories
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor)

### Assignments
- `GET /api/assignments/courses/:courseId/assignments` - Get course assignments
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/assignments` - Create assignment (Admin/Instructor)
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

### Submissions
- `POST /api/submissions` - Submit assignment (Student)
- `GET /api/submissions/my-submissions` - Get my submissions
- `PATCH /api/submissions/:id/status` - Update status (Admin)

### Certificates
- `POST /api/certificates/generate/:courseId` - Generate certificate
- `GET /api/certificates/my-certificates` - Get my certificates
- `GET /api/certificates/verify/:certificateId` - Verify certificate

## 🎨 UI Components

### Core Components
- **CourseCard** - Modern course display with animations
- **AssignmentCard** - Assignment with status badges
- **MegaMenu** - Category navigation dropdown
- **ProgressBar** - Visual progress tracking

### Pages
- **HomePage** - Hero section, popular/new courses
- **CourseDetails** - Full course information
- **CourseAssignments** - Assignment list
- **AssignmentDetails** - Assignment submission
- **CertificatePage** - Certificate management

## 🔒 Security Features

- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Input validation with Zod

## 📦 Database Schema

### Key Models
- **User** - Students, instructors, admins
- **Course** - Course information
- **Assignment** - Course assignments
- **Submission** - Student submissions
- **Certificate** - Earned certificates
- **AssignmentProgress** - Progress tracking
- **Review** - Course reviews
- **Enrollment** - Course enrollments

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend
2. Login with test accounts
3. Test student workflow:
   - Browse courses
   - Enroll in course
   - Submit assignment
   - Generate certificate
4. Test instructor workflow:
   - Create course
   - Add assignments
   - Review submissions
5. Test admin workflow:
   - Manage courses
   - Review all submissions

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Run migrations again
npx prisma migrate dev
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Change port in frontend/.env VITE_API_URL
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npx prisma generate
```

### CORS Errors
```bash
# Verify FRONTEND_URL in backend/.env
# Check VITE_API_URL in frontend/.env
```

## 📝 Environment Variables

### Backend (.env)
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

### Frontend (.env)
```env
VITE_API_URL="http://localhost:5001/api"
VITE_BASE_URL="http://localhost:5001"
```

## 🎯 Future Enhancements

- [ ] Real-time notifications (Socket.io)
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Social sharing
- [ ] Advanced analytics dashboard
- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Backend: Node.js + Express + Prisma
- Frontend: React + TypeScript + Vite
- UI/UX: ShadCN UI + TailwindCSS + Framer Motion

## 🙏 Acknowledgments

- ShadCN UI for beautiful components
- Framer Motion for smooth animations
- Prisma for excellent ORM
- React Query for data fetching

---

**Built with ❤️ using the MERN Stack**
