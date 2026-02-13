import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AssignmentCard from '@/components/AssignmentCard';
import api from '@/services/api';

const CourseAssignments = () => {
    const { courseId } = useParams<{ courseId: string }>();

    // Fetch course details
    const { data: course } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data.data;
        },
    });

    // Fetch assignments
    const { data: assignments, isLoading } = useQuery({
        queryKey: ['assignments', courseId],
        queryFn: async () => {
            const res = await api.get(`/assignments/courses/${courseId}/assignments`);
            return res.data.data;
        },
    });

    // Fetch my submissions
    const { data: submissions } = useQuery({
        queryKey: ['submissions', 'my'],
        queryFn: async () => {
            const res = await api.get('/submissions/my-submissions');
            return res.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading assignments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link to={`/courses/${courseId}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Course
                        </Button>
                    </Link>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    {course?.title || 'Course Assignments'}
                                </h1>
                                <p className="text-slate-600">
                                    Complete assignments to track your progress and earn your certificate
                                </p>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        {assignments && (
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{assignments.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Assignments</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {submissions?.filter((s: any) =>
                                            assignments.some((a: any) => a.id === s.assignment.id)
                                        ).length || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {assignments.length - (submissions?.filter((s: any) =>
                                            assignments.some((a: any) => a.id === s.assignment.id)
                                        ).length || 0)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Assignments List */}
                {assignments && assignments.length > 0 ? (
                    <div className="grid gap-6">
                        {assignments.map((assignment: any, index: number) => {
                            const submission = submissions?.find(
                                (s: any) => s.assignment.id === assignment.id
                            );

                            return (
                                <motion.div
                                    key={assignment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <AssignmentCard
                                        assignment={assignment}
                                        submission={submission}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-slate-100"
                    >
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No Assignments Yet
                        </h3>
                        <p className="text-slate-600">
                            Assignments will appear here once the instructor adds them
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CourseAssignments;
