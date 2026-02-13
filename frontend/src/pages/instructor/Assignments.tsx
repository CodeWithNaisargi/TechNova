import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { format } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';

export default function InstructorAssignments() {
    // Fetch instructor's courses
    const { isLoading: coursesLoading } = useQuery({
        queryKey: ['instructor-courses'],
        queryFn: async () => {
            const res = await api.get('/instructor/courses');
            return res.data?.data || [];
        },
    });

    // Fetch all assignments for instructor's courses
    const { data: assignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
        queryKey: ['instructor-assignments'],
        queryFn: async () => {
            const res = await api.get('/instructor/assignments');
            return res.data?.data || [];
        },
    });

    // Listen for real-time assignment updates
    useSocket('assignment:created', () => {
        console.log('New assignment created');
        refetchAssignments();
    });

    useSocket('assignment:updated', () => {
        console.log('Assignment updated');
        refetchAssignments();
    });

    useSocket('submission:created', () => {
        console.log('New submission received');
        refetchAssignments();
    });

    useSocket('submission:graded', () => {
        console.log('Submission graded');
        refetchAssignments();
    });

    const isLoading = coursesLoading || assignmentsLoading;

    // Calculate stats from assignments data
    const stats = {
        total: assignments.length,
        pending: assignments.filter((a: any) => a.status === 'PENDING' || !a.status).length,
        graded: assignments.filter((a: any) => a.status === 'GRADED').length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading assignments...</p>
                </div>
            </div>
        );
    }

    const kpiCards = [
        {
            title: 'Total Assignments',
            value: stats?.total || assignments.length || 0,
            icon: FileText,
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Pending Review',
            value: stats?.pending || 0,
            icon: Clock,
            gradient: 'from-orange-500 to-red-500',
        },
        {
            title: 'Graded',
            value: stats?.graded || 0,
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* HERO SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold">Assignment Management</h1>
                                <p className="text-blue-100 mt-2">Manage and review all course assignments</p>
                            </div>
                            <Link to="/instructor/courses">
                                <Button variant="secondary" size="lg">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Assignment
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {kpiCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm">{card.title}</p>
                                            <h3 className="text-4xl font-bold mt-1">{card.value}</h3>
                                        </div>
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                                            <card.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* ASSIGNMENTS LIST */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex gap-2 items-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                                All Assignments
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {assignments.length > 0 ? (
                                <div className="space-y-4">
                                    {assignments.map((assignment: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                                        <Badge variant={assignment.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                                            {assignment.status || 'DRAFT'}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {assignment.description || 'No description'}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="w-4 h-4" />
                                                            {assignment.course?.title || 'Unknown Course'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {assignment.submissions?.length || 0} submissions
                                                        </span>
                                                        {assignment.dueDate && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link to={`/instructor/submissions?assignmentId=${assignment.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            View Submissions
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Assignments Yet</h3>
                                    <p className="text-gray-500 mb-4">Create your first assignment to get started</p>
                                    <Link to="/instructor/courses">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Go to Courses
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
}
