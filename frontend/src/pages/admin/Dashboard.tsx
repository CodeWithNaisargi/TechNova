import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    GraduationCap,
    FileText,
    CheckCircle,
    Clock,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    // Fetch all courses
    const { data: courses } = useQuery({
        queryKey: ['admin', 'courses'],
        queryFn: async () => {
            const res = await api.get('/admin/courses');
            return res.data.data;
        },
    });

    // Fetch all users
    const { data: users } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const res = await api.get('/admin/users');
            return res.data.data;
        },
    });

    // Fetch all submissions
    const { data: submissions } = useQuery({
        queryKey: ['admin', 'submissions'],
        queryFn: async () => {
            const res = await api.get('/submissions');
            return res.data.data;
        },
    });

    // Calculate statistics
    const stats = {
        totalCourses: courses?.length || 0,
        publishedCourses: courses?.filter((c: any) => c.isPublished).length || 0,
        totalStudents: users?.filter((u: any) => u.role === 'STUDENT').length || 0,
        totalInstructors: users?.filter((u: any) => u.role === 'INSTRUCTOR').length || 0,
        totalSubmissions: submissions?.length || 0,
        pendingSubmissions: submissions?.filter((s: any) => s.status === 'PENDING').length || 0,
        approvedSubmissions: submissions?.filter((s: any) => s.status === 'APPROVED').length || 0,
    };

    const statCards = [
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            subtitle: `${stats.publishedCourses} published`,
            icon: BookOpen,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            link: '/admin/courses',
        },
        {
            title: 'Students',
            value: stats.totalStudents,
            subtitle: 'Active learners',
            icon: Users,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            link: '/admin/users?role=student',
        },
        {
            title: 'Instructors',
            value: stats.totalInstructors,
            subtitle: 'Teaching staff',
            icon: GraduationCap,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            link: '/admin/users?role=instructor',
        },
        {
            title: 'Submissions',
            value: stats.totalSubmissions,
            subtitle: `${stats.pendingSubmissions} pending`,
            icon: FileText,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            link: '/admin/submissions',
        },
        {
            title: 'Approval Rate',
            value: stats.totalSubmissions > 0
                ? `${Math.round((stats.approvedSubmissions / stats.totalSubmissions) * 100)}%`
                : '0%',
            subtitle: `${stats.approvedSubmissions} approved`,
            icon: CheckCircle,
            color: 'from-teal-500 to-cyan-500',
            bgColor: 'bg-teal-50',
            link: '/admin/submissions',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-600">Manage your EdTech platform</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={stat.link}>
                                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                                    {stat.title}
                                                </p>
                                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                                    {stat.value}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {stat.subtitle}
                                                </p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Recent Submissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {submissions && submissions.length > 0 ? (
                                    <div className="space-y-3">
                                        {submissions.slice(0, 5).map((submission: any) => (
                                            <div
                                                key={submission.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{submission.student?.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {submission.assignment?.title}
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={
                                                        submission.status === 'PENDING'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : submission.status === 'APPROVED'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }
                                                >
                                                    {submission.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No submissions yet
                                    </p>
                                )}
                                <Link to="/admin/submissions">
                                    <button className="w-full mt-4 text-sm text-primary hover:underline">
                                        View All Submissions →
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Link to="/admin/courses/new">
                                        <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all">
                                            <BookOpen className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Create New Course</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/assignments/new">
                                        <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                                            <FileText className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Add Assignment</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/users">
                                        <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all">
                                            <Users className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Manage Users</span>
                                        </button>
                                    </Link>

                                    {stats.pendingSubmissions > 0 && (
                                        <Link to="/admin/submissions?status=PENDING">
                                            <button className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all">
                                                <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                                                <span className="font-semibold">
                                                    Review {stats.pendingSubmissions} Pending Submissions
                                                </span>
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Category Distribution */}
                {courses && courses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(
                                        courses.reduce((acc: any, course: any) => {
                                            acc[course.category] = (acc[course.category] || 0) + 1;
                                            return acc;
                                        }, {})
                                    ).map(([category, count]: any) => (
                                        <div
                                            key={category}
                                            className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg text-center"
                                        >
                                            <p className="text-2xl font-bold text-primary">{count}</p>
                                            <p className="text-sm text-muted-foreground">{category}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
