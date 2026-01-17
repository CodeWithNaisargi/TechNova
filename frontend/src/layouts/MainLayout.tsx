import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-background sticky top-0 z-50">
                <div className="container flex h-16 items-center justify-between px-4">
                    <Link to="/" className="text-2xl font-bold text-primary">LMS Platform</Link>
                    <nav className="flex items-center gap-4">
                        <Link to="/courses" className="text-sm font-medium hover:underline">Browse Courses</Link>
                        {user ? (
                            <>
                                {user.role === 'STUDENT' && <Link to="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>}
                                {user.role === 'INSTRUCTOR' && <Link to="/instructor/dashboard" className="text-sm font-medium hover:underline">Instructor Panel</Link>}
                                {user.role === 'ADMIN' && <Link to="/admin/dashboard" className="text-sm font-medium hover:underline">Admin Panel</Link>}
                                <Button variant="ghost" onClick={logout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                                <Link to="/register"><Button>Get Started</Button></Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
