import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, Menu, Brain } from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { isOpen, toggle, close } = useSidebar();

    if (!user) return null;

    // Auto-close sidebar on navigation (mobile/tablet only)
    useEffect(() => {
        // Only auto-close if sidebar is open and we're on mobile
        if (window.innerWidth < 768 && isOpen) {
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]); // Only depend on pathname to avoid interference with toggle

    const sidebarItems = [
        { label: 'Dashboard', href: user.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard', icon: LayoutDashboard },
        { label: 'Courses', href: user.role === 'INSTRUCTOR' ? '/instructor/courses' : '/courses', icon: BookOpen },
        ...(user.role === 'STUDENT' ? [{ label: 'Insights', href: '/insights', icon: Brain }] : []),
        ...(user.role === 'ADMIN' ? [{ label: 'Users', href: '/admin/users', icon: Users }] : []),
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-background overflow-x-hidden">
            {/* Sidebar - Responsive */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen w-[260px] bg-background border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out",
                    "md:translate-x-0 md:fixed",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="h-20 flex items-center px-6 border-b border-border flex-shrink-0">
                    <Link to="/" className="text-2xl font-semibold text-foreground tracking-tight">SkillOrbit</Link>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.href ||
                            (item.href !== '/' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => {
                                    // Auto-close on mobile/tablet
                                    if (window.innerWidth < 768) {
                                        close();
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative",
                                    isActive
                                        ? "bg-primary/20 text-primary shadow-sm dark:bg-primary/10"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border flex-shrink-0">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col bg-background transition-all duration-300 w-full min-w-0",
                "md:ml-[260px]",
                // On mobile/tablet, push content when sidebar is open
                isOpen ? "ml-[260px]" : "ml-0 md:ml-[260px]"
            )}>
                {/* Hamburger menu button - always visible on mobile, positioned based on sidebar state */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "fixed z-50 bg-background border border-border shadow-lg md:hidden transition-all duration-300",
                        isOpen ? "top-4 left-[260px]" : "top-4 left-4"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle();
                    }}
                    type="button"
                    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                {/* Header with NotificationBell */}
                <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        {/* Empty div to balance space if needed, or put breadcrumbs here */}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                        <NotificationDropdown />
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-foreground">{user.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full min-h-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
