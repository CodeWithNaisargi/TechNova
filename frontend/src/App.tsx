import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import OnboardingLayout from '@/layouts/OnboardingLayout';
import { SidebarProvider } from '@/context/SidebarContext';
import OnboardingGuard from '@/components/guards/OnboardingGuard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import VerifyEmail from '@/pages/VerifyEmail';
import Home from '@/pages/Home';
import BrowseCourses from '@/pages/BrowseCourses';
import CourseDetails from '@/pages/CourseDetails';
import LearningPlayer from '@/pages/LearningPlayer';
import StudentDashboard from '@/pages/student/Dashboard';
import StudentInterestSelection from '@/pages/student/StudentInterestSelection';
import EducationLevelSelection from '@/pages/student/EducationLevelSelection';
import CourseAssignments from '@/pages/student/CourseAssignments';
import AssignmentDetails from '@/pages/student/AssignmentDetails';
import CertificatePage from '@/pages/student/CertificatePage';
import Settings from '@/pages/student/Settings';
import InstructorDashboard from '@/pages/instructor/Dashboard';
import InstructorSubmissions from '@/pages/instructor/SubmissionReview';
import InstructorAssignments from '@/pages/instructor/Assignments';
import CourseList from '@/pages/instructor/CourseList';
import CourseBuilder from '@/pages/instructor/CourseBuilder';
import AdminDashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import SubmissionsReview from '@/pages/admin/SubmissionsReview';
import CreateAssignment from '@/pages/admin/CreateAssignment';
import { Toaster } from '@/components/ui/toaster';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// Dashboard Guard - Ensures onboarding is complete before dashboard access
const DashboardGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    // Students must complete onboarding before accessing dashboard
    if (user.role === 'STUDENT') {
        if (!user.educationLevel) {
            return <Navigate to="/onboarding/education" replace />;
        }
        // Check for careerFocusId (new) OR interestedCareerPath (legacy)
        if (!user.careerFocusId && !user.interestedCareerPath) {
            return <Navigate to="/onboarding/career" replace />;
        }
    }

    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes with MainLayout (Navbar) */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                {/* Onboarding Routes - LOCKED after completion */}
                <Route path="/onboarding" element={<OnboardingGuard><OnboardingLayout /></OnboardingGuard>}>
                    <Route path="education" element={<EducationLevelSelection />} />
                    <Route path="career" element={<StudentInterestSelection />} />
                </Route>

                {/* Protected Dashboard Routes - Requires completed onboarding for students */}
                <Route element={<DashboardGuard><SidebarProvider><DashboardLayout /></SidebarProvider></DashboardGuard>}>
                    {/* Student */}
                    <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/courses" element={<ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}><BrowseCourses /></ProtectedRoute>} />
                    <Route path="/courses/:id" element={<ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}><CourseDetails /></ProtectedRoute>} />
                    <Route path="/learning/:courseId" element={<ProtectedRoute allowedRoles={['STUDENT']}><LearningPlayer /></ProtectedRoute>} />
                    <Route path="/courses/:courseId/assignments" element={<ProtectedRoute allowedRoles={['STUDENT']}><CourseAssignments /></ProtectedRoute>} />
                    <Route path="/courses/:courseId/assignments/:assignmentId" element={<ProtectedRoute allowedRoles={['STUDENT']}><AssignmentDetails /></ProtectedRoute>} />
                    <Route path="/assignments/:assignmentId" element={<ProtectedRoute allowedRoles={['STUDENT']}><AssignmentDetails /></ProtectedRoute>} />
                    <Route path="/certificates" element={<ProtectedRoute allowedRoles={['STUDENT']}><CertificatePage /></ProtectedRoute>} />

                    {/* Instructor */}
                    <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><InstructorDashboard /></ProtectedRoute>} />
                    <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><CourseList /></ProtectedRoute>} />
                    <Route path="/instructor/courses/new" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><CourseBuilder /></ProtectedRoute>} />
                    <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><CourseBuilder /></ProtectedRoute>} />
                    <Route path="/instructor/assignments" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><InstructorAssignments /></ProtectedRoute>} />
                    <Route path="/instructor/submissions" element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}><InstructorSubmissions /></ProtectedRoute>} />

                    {/* Admin */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/courses/new" element={<ProtectedRoute allowedRoles={['ADMIN']}><CourseBuilder /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
                    <Route path="/admin/submissions" element={<ProtectedRoute allowedRoles={['ADMIN']}><SubmissionsReview /></ProtectedRoute>} />
                    <Route path="/admin/assignments/new" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateAssignment /></ProtectedRoute>} />

                    {/* Settings (All roles) */}
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Legacy redirects for old onboarding URLs */}
                <Route path="/student/select-education" element={<Navigate to="/onboarding/education" replace />} />
                <Route path="/student/select-interest" element={<Navigate to="/onboarding/career" replace />} />
            </Routes>
            <Toaster />
        </AuthProvider>
    );
}

export default App;
