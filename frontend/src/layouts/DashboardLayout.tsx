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
        <div className="min-h-screen flex bg-white">
            {/* Sidebar */}
            <aside className="w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-20 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="text-2xl font-semibold text-gray-900 tracking-tight">SkillOrbit</Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.href || 
                            (item.href !== '/' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                                    isActive
                                        ? "bg-[#EAF2FF] text-[#2563EB] shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#2563EB] rounded-r-full" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive ? "text-[#2563EB]" : "text-gray-500")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-gray-50">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
                    <Link to="/" className="text-xl font-semibold text-gray-900">SkillOrbit</Link>
                    {/* Mobile menu trigger would go here */}
                </header>
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
