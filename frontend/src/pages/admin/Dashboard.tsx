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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 text-base">Monitor and manage your EdTech platform</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={stat.link}>
                                <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-600 mb-2">
                                                    {stat.title}
                                                </p>
                                                <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                                                    {stat.value}
                                                </h3>
                                                <p className="text-xs text-gray-500">
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
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                    Recent Submissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {submissions && submissions.length > 0 ? (
                                    <div className="space-y-3">
                                        {submissions.slice(0, 5).map((submission: any) => (
                                            <div
                                                key={submission.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">{submission.student?.name}</p>
                                                    <p className="text-xs text-gray-600 truncate mt-1">
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
                                    <p className="text-sm text-gray-500 text-center py-8">
                                        No submissions yet
                                    </p>
                                )}
                                <Link to="/admin/submissions">
                                    <button className="w-full mt-4 text-sm text-[#2563EB] hover:text-[#1d4ed8] hover:underline font-medium">
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
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <TrendingUp className="w-5 h-5 text-gray-600" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Link to="/admin/courses/new">
                                        <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                            <BookOpen className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Create New Course</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/assignments/new">
                                        <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                            <FileText className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Add Assignment</span>
                                        </button>
                                    </Link>

                                    <Link to="/admin/users">
                                        <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                            <Users className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">Manage Users</span>
                                        </button>
                                    </Link>

                                    {stats.pendingSubmissions > 0 && (
                                        <Link to="/admin/submissions?status=PENDING">
                                            <button className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
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
                        className="mt-10"
                    >
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900">Course Categories</CardTitle>
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
                                            className="p-5 bg-gray-50 rounded-lg text-center border border-gray-100 hover:bg-gray-100 transition-colors"
                                        >
                                            <p className="text-2xl font-semibold text-gray-900 mb-1">{count}</p>
                                            <p className="text-sm text-gray-600">{category}</p>
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
