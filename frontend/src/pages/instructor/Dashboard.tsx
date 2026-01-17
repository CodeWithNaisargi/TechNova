import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    FileText,
    Clock,
    TrendingUp,
    Plus,
    Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
    // Fetch instructor stats
    const { data: stats } = useQuery({
        queryKey: ['instructor', 'stats'],
        queryFn: async () => {
            const res = await api.get('/instructor/stats');
            return res.data.data;
        },
    });

    // Fetch instructor courses
    const { data: courses } = useQuery({
        queryKey: ['instructor', 'courses'],
        queryFn: async () => {
            const res = await api.get('/instructor/courses');
            return res.data.data;
        },
    });

    // Fetch recent submissions
    const { data: submissions } = useQuery({
        queryKey: ['instructor', 'submissions'],
        queryFn: async () => {
            const res = await api.get('/instructor/submissions');
            return res.data.data;
        },
    });

    const statCards = [
        {
            title: 'Total Courses',
            value: stats?.totalCourses || 0,
            subtitle: `${stats?.publishedCourses || 0} published`,
            icon: BookOpen,
            color: 'from-blue-500 to-cyan-500',
            link: '/instructor/courses',
        },
        {
            title: 'Students Enrolled',
            value: stats?.totalEnrollments || 0,
            subtitle: 'Across all courses',
            icon: Users,
            color: 'from-green-500 to-emerald-500',
            link: '/instructor/courses',
        },
        {
            title: 'Pending Reviews',
            value: stats?.pendingSubmissions || 0,
            subtitle: 'Awaiting feedback',
            icon: Clock,
            color: 'from-orange-500 to-red-500',
            link: '/instructor/submissions?status=PENDING',
        },
        {
            title: 'Total Submissions',
            value: submissions?.length || 0,
            subtitle: 'All time',
            icon: FileText,
            color: 'from-purple-500 to-pink-500',
            link: '/instructor/submissions',
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
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Instructor Dashboard</h1>
                    <p className="text-gray-600 text-base">Manage your courses and review submissions</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    {/* My Courses */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <BookOpen className="w-5 h-5 text-gray-600" />
                                    My Courses
                                </CardTitle>
                                <Link to="/instructor/courses/new">
                                    <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Course
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {courses && courses.length > 0 ? (
                                    <div className="space-y-3">
                                        {courses.slice(0, 5).map((course: any) => (
                                            <div
                                                key={course.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">{course.title}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-gray-600">
                                                            {course._count.enrollments} students
                                                        </span>
                                                        <span className="text-xs text-gray-600">
                                                            {course._count.assignments} assignments
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge variant={course.isPublished ? 'default' : 'secondary'} className={course.isPublished ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 mb-4">
                                            No courses yet
                                        </p>
                                        <Link to="/instructor/courses/new">
                                            <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">Create Your First Course</Button>
                                        </Link>
                                    </div>
                                )}
                                {courses && courses.length > 5 && (
                                    <Link to="/instructor/courses">
                                        <button className="w-full mt-4 text-sm text-[#2563EB] hover:text-[#1d4ed8] hover:underline font-medium">
                                            View All Courses →
                                        </button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border border-gray-200 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                    Recent Submissions
                                </CardTitle>
                                <Link to="/instructor/submissions">
                                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View All
                                    </Button>
                                </Link>
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
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10"
                >
                    <Card className="border border-gray-200 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <Link to="/instructor/courses/new">
                                    <button className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                        <Plus className="w-5 h-5 mx-auto mb-2" />
                                        <span className="font-semibold">Create Course</span>
                                    </button>
                                </Link>

                                <Link to="/instructor/assignments">
                                    <button className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                        <FileText className="w-5 h-5 mx-auto mb-2" />
                                        <span className="font-semibold">Manage Assignments</span>
                                    </button>
                                </Link>

                                {stats?.pendingSubmissions > 0 && (
                                    <Link to="/instructor/submissions?status=PENDING">
                                        <button className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all font-medium">
                                            <Clock className="w-5 h-5 mx-auto mb-2" />
                                            <span className="font-semibold">
                                                Review {stats.pendingSubmissions} Submissions
                                            </span>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
