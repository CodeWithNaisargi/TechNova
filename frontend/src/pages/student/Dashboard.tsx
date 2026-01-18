import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    BookOpen,
    FileText,
    Award,
    CheckCircle,
    TrendingUp,
    Clock,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import api from "@/services/api";
import RecommendationsSection from "@/components/student/RecommendationsSection";

export default function Dashboard() {
    const { user } = useAuth();

    // Fetch student dashboard stats
    const { data, isLoading, error } = useQuery({
        queryKey: ["student-dashboard"],
        queryFn: async () => {
            const res = await api.get("/student/dashboard");
            return res.data;
        },
    });

    // Fetch enrolled courses with unified progress
    const { data: enrolledCourses = [], refetch: refetchProgress } = useQuery({
        queryKey: ["student-enrollments-with-progress"],
        queryFn: async () => {
            const enrollmentsRes = await api.get("/enrollments/my");
            const enrollments = enrollmentsRes.data?.data || [];

            // Fetch progress for each enrolled course
            const coursesWithProgress = await Promise.all(
                enrollments.map(async (enrollment: any) => {
                    try {
                        const progressRes = await api.get(`/progress/${enrollment.courseId}`);
                        return {
                            ...enrollment,
                            progress: progressRes.data?.data || null
                        };
                    } catch (err) {
                        return {
                            ...enrollment,
                            progress: null
                        };
                    }
                })
            );

            return coursesWithProgress;
        },
    });

    // Fetch popular courses - STRICT: Only courses matching user's education level
    const { data: popularCourses = [] } = useQuery({
        queryKey: ["popular-courses", user?.educationLevel],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (user?.educationLevel) {
                params.append('educationLevel', user.educationLevel);
            }
            const res = await api.get(`/courses/popular?${params.toString()}`);
            return res.data?.data || [];
        },
        enabled: !!user,
    });

    // Listen for real-time progress updates
    useSocket("progress:updated", (data: any) => {
        console.log("Progress updated:", data);
        refetchProgress();
    });

    // Listen for certificate generation
    useSocket("certificate:generated", (data: any) => {
        console.log("Certificate generated:", data);
        refetchProgress();
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 font-semibold">Error loading dashboard</p>
                </div>
            </div>
        );
    }

    const stats = {
        enrolledCourses: data?.totalEnrolledCourses || enrolledCourses.length || 0,
        pendingAssignments: data?.pendingAssignments || 0,
        certificates: data?.certificates || 0,
        completedAssignments: data?.completedAssignments || 0,
    };

    const kpiCards = [
        {
            title: "Courses Enrolled",
            value: stats.enrolledCourses,
            icon: BookOpen,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: "Assignments Pending",
            value: stats.pendingAssignments,
            icon: FileText,
            gradient: "from-orange-500 to-red-500",
        },
        {
            title: "Certificates Earned",
            value: stats.certificates,
            icon: Award,
            gradient: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">

                {/* HERO SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8 md:mb-10 pt-4 sm:pt-6">
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 sm:p-8 text-primary-foreground shadow-lg">
                        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome back, {user?.name || "Student"} 👋</h1>
                        <p className="text-primary-foreground/80 text-sm sm:text-base">Let's continue your learning journey</p>
                    </div>
                </motion.div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                    {kpiCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="shadow-sm hover:shadow-md transition-shadow border border-border">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-muted-foreground text-sm mb-2">{card.title}</p>
                                            <h3 className="text-3xl font-semibold text-foreground">{card.value}</h3>
                                        </div>
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                                            <card.icon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* AI RECOMMENDATIONS */}
                <RecommendationsSection />

                <div className="grid lg:grid-cols-3 gap-6 mb-10 mt-10">

                    {/* LEARNING PROGRESS */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                        <Card className="shadow-sm border border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex gap-2 items-center text-lg font-semibold text-foreground">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Learning Progress
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {enrolledCourses.length > 0 ? (
                                    enrolledCourses.map((enrollment: any, i: number) => {
                                        const progress = enrollment.progress;
                                        const percentage = progress?.percentage || 0;
                                        const thumbnail = enrollment.course?.thumbnail || null;

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="space-y-3 p-4 bg-secondary rounded-lg border border-border hover:bg-secondary/80 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {thumbnail && (
                                                        <img
                                                            src={thumbnail}
                                                            alt={enrollment.course?.title}
                                                            className="w-20 h-14 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="font-semibold text-foreground text-sm">{enrollment.course?.title}</p>
                                                            <span className="text-sm font-semibold text-primary">{percentage}%</span>
                                                        </div>

                                                        {/* Animated Progress Bar */}
                                                        <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden mb-2">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                                                            />
                                                        </div>

                                                        {progress && (
                                                            <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                                                                {progress.totalLessons > 0 && (
                                                                    <span>📚 {progress.completedLessons}/{progress.totalLessons} lessons</span>
                                                                )}
                                                                <span>📝 {progress.completedAssignments}/{progress.totalAssignments} assignments</span>
                                                            </div>
                                                        )}

                                                        <Link to={`/learning/${enrollment.courseId}`}>
                                                            <Button variant="outline" size="sm" className="mt-2">
                                                                Continue Learning <ArrowRight className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">No courses enrolled yet.</p>
                                        <Link to="/courses">
                                            <Button className="mt-4 bg-primary hover:bg-primary/90">Browse Courses</Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* RECENT ACTIVITY */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className="shadow-sm border border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex gap-2 items-center text-lg font-semibold text-foreground">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.completedAssignments > 0 ? (
                                    <div className="space-y-3">
                                        <div className="p-4 bg-secondary rounded-lg flex gap-3 items-center border border-border">
                                            <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-sm text-foreground">{stats.completedAssignments} Assignments Completed</p>
                                                <p className="text-xs text-muted-foreground mt-1">Great progress!</p>
                                            </div>
                                        </div>

                                        {stats.certificates > 0 && (
                                            <div className="p-4 bg-secondary rounded-lg flex gap-3 items-center border border-border">
                                                <Award className="text-purple-500 w-5 h-5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{stats.certificates} Certificates Earned</p>
                                                    <Link to="/certificates">
                                                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary hover:text-primary/80">
                                                            View Certificates
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm text-center py-4">No recent activity.</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* RECOMMENDED COURSES */}
                {popularCourses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10"
                    >
                        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">Recommended Courses</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {popularCourses.slice(0, 4).map((course: any, i: number) => {
                                const thumbnail = course.thumbnail || null;

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                    >
                                        <Card className="shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-border">
                                            {thumbnail && (
                                                <img
                                                    src={thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-40 object-cover"
                                                />
                                            )}
                                            <CardContent className="p-5">
                                                <p className="font-semibold mb-2 text-foreground">{course.title}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                                                <Link to={`/courses/${course.id}`}>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Course
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
