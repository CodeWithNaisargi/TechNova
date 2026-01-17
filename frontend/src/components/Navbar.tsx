import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const Navbar = () => {
    const { data: user } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            try {
                const res = await api.get('/auth/me');
                return res.data.data;
            } catch (e) {
                return null;
            }
        },
        retry: false,
    });

    const handleLogout = async () => {
        await api.post('/auth/logout');
        window.location.href = '/login';
    };

    return (
        <nav className="border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link to="/" className="text-2xl font-bold text-primary">LMS Platform</Link>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium hover:underline">Browse</Link>
                    {user ? (
                        <>
                            {user.role === 'STUDENT' && <Link to="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>}
                            {user.role === 'INSTRUCTOR' && <Link to="/instructor/dashboard" className="text-sm font-medium hover:underline">Instructor Panel</Link>}
                            {user.role === 'ADMIN' && <Link to="/admin/dashboard" className="text-sm font-medium hover:underline">Admin Panel</Link>}
                            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><Button variant="ghost">Login</Button></Link>
                            <Link to="/register"><Button>Get Started</Button></Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
