import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const sidebarItems = [
        { label: 'Dashboard', href: user.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard', icon: LayoutDashboard },
        { label: 'Courses', href: user.role === 'INSTRUCTOR' ? '/instructor/courses' : '/courses', icon: BookOpen },
        ...(user.role === 'ADMIN' ? [{ label: 'Users', href: '/admin/users', icon: Users }] : []),
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link to="/" className="text-xl font-bold text-primary">LMS Platform</Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                location.pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 md:hidden">
                    <Link to="/" className="text-xl font-bold">LMS</Link>
                    {/* Mobile menu trigger would go here */}
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
