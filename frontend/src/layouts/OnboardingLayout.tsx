import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * OnboardingLayout - Clean layout for first-time user onboarding
 * 
 * Features:
 * - No sidebar
 * - No dashboard navbar
 * - Centered content
 * - Clean, focused onboarding UI
 * - Progress indicator
 */
const OnboardingLayout = () => {
    const { user, isLoading } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to dashboard if onboarding is complete
    if (user.educationLevel && user.interestedCareerPath) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">SkillOrbit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Welcome,</span>
                        <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Progress indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center gap-4">
                            <div className={`flex items-center gap-2 ${!user.educationLevel ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${!user.educationLevel ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}>
                                    {user.educationLevel ? '✓' : '1'}
                                </div>
                                <span className="font-medium">Education Level</span>
                            </div>
                            <div className="w-12 h-0.5 bg-gray-300"></div>
                            <div className={`flex items-center gap-2 ${user.educationLevel && !user.interestedCareerPath ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${user.interestedCareerPath ? 'bg-green-500 text-white' : user.educationLevel ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    {user.interestedCareerPath ? '✓' : '2'}
                                </div>
                                <span className="font-medium">Career Interest</span>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm">
                <p>Complete these steps to personalize your learning experience</p>
            </footer>
        </div>
    );
};

export default OnboardingLayout;
