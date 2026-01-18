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
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8 md:mb-10 pt-4 sm:pt-6"
                >
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Monitor and manage your EdTech platform</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={stat.link}>
                                <Card className="hover:shadow-lg transition-all duration-200 border border-border cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                    {stat.title}
                                                </p>
                                                <h3 className="text-3xl font-semibold text-foreground mb-2">
                                                    {stat.value}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {stat.subtitle}
                                                </p>
                                            </div>
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                                <stat.icon className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                    Recent Submissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {submissions && submissions.length > 0 ? (
                                    <div className="space-y-3">
                                        {submissions.slice(0, 5).map((submission: any) => (
                                            <div
                                                key={submission.id}
                                                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-foreground">{submission.student?.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                                        {submission.assignment?.title}
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={
                                                        submission.status === 'PENDING'
                                                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                            : submission.status === 'APPROVED'
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : 'bg-red-100 text-red-800 border-red-200'
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
                                    <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 hover:underline font-medium">
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
                        <Card className="border border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 sm:space-y-4">
                                    <Link to="/admin/courses/new">
                                        <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                            <BookOpen className="w-5 h-5" />
                                            <span className="font-semibold text-sm sm:text-base">Create New Course</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/assignments/new">
                                        <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            <span className="font-semibold text-sm sm:text-base">Add Assignment</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/users">
                                        <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            <span className="font-semibold text-sm sm:text-base">Manage Users</span>
                                        </button>
                                    </Link>

                                    {stats.pendingSubmissions > 0 && (
                                        <Link to="/admin/submissions?status=PENDING">
                                            <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                                <AlertCircle className="w-5 h-5" />
                                                <span className="font-semibold text-center text-sm sm:text-base">
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
                        className="mt-10"
                    >
                        <Card className="border border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-foreground">Course Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {Object.entries(
                                        courses.reduce((acc: any, course: any) => {
                                            acc[course.category] = (acc[course.category] || 0) + 1;
                                            return acc;
                                        }, {})
                                    ).map(([category, count]: any) => (
                                        <div
                                            key={category}
                                            className="p-6 bg-secondary rounded-lg text-center border border-border hover:border-primary hover:bg-primary/10 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <p className="text-3xl font-semibold text-foreground mb-2">{count}</p>
                                            <p className="text-sm font-medium text-muted-foreground">{category}</p>
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
