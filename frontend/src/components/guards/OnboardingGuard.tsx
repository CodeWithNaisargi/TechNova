import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * OnboardingGuard - Prevents users from accessing onboarding routes after completion
 * 
 * If user has completed onboarding (onboardingCompleted === true),
 * they are redirected to the dashboard.
 * 
 * This prevents:
 * - Browser back button to onboarding
 * - Manual URL access to /onboarding/*
 */
const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    // Wait for auth to load
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If onboarding is already completed, redirect to dashboard
    if (user.onboardingCompleted) {
        return <Navigate to="/dashboard" replace />;
    }

    // Allow access to onboarding
    return <>{children}</>;
};

export default OnboardingGuard;
