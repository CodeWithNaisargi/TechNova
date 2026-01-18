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
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
                    className="mb-10 pt-6"
=======
                    className="mb-6 sm:mb-8 md:mb-10 pt-4 sm:pt-6"
>>>>>>> 6b0f6c510c3e809ce1b5a3b7d7701b384f986c9d
                >
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">Instructor Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage your courses and review submissions</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
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

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                    {/* My Courses */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                                    My Courses
                                </CardTitle>
                                <Link to="/instructor/courses/new">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
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
                                                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-foreground">{course.title}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {course._count.enrollments} students
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {course._count.assignments} assignments
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            No courses yet
                                        </p>
                                        <Link to="/instructor/courses/new">
                                            <Button className="bg-primary hover:bg-primary/90">Create Your First Course</Button>
                                        </Link>
                                    </div>
                                )}
                                {courses && courses.length > 5 && (
                                    <Link to="/instructor/courses">
                                        <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 hover:underline font-medium">
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
                        <Card className="border border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                    Recent Submissions
                                </CardTitle>
                                <Link to="/instructor/submissions">
                                    <Button size="sm" variant="outline">
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
                                                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-foreground">{submission.student?.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                                        {submission.assignment?.title}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        submission.status === 'PENDING'
                                                            ? 'default'
                                                            : submission.status === 'APPROVED'
                                                                ? 'default'
                                                                : 'destructive'
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
                    <Card className="border border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                <Link to="/instructor/courses/new">
                                    <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        <span className="font-semibold text-sm sm:text-base">Create Course</span>
                                    </button>
                                </Link>

                                <Link to="/instructor/assignments">
                                    <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        <span className="font-semibold text-sm sm:text-base">Manage Assignments</span>
                                    </button>
                                </Link>

                                {stats?.pendingSubmissions > 0 && (
                                    <Link to="/instructor/submissions?status=PENDING" className="sm:col-span-2 md:col-span-1">
                                        <button className="w-full p-4 sm:p-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all font-medium flex flex-col items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            <span className="font-semibold text-center text-sm sm:text-base">
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
