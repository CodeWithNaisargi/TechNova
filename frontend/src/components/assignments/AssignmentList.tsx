import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, FileText, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { useState } from 'react';

interface Assignment {
    id: string;
    title: string;
    description?: string;
    order: number;
    status: string;
    isCompleted: boolean;
    completedAt: string | null;
}

interface AssignmentListProps {
    courseId: string;
}

export default function AssignmentList({ courseId }: AssignmentListProps) {
    const queryClient = useQueryClient();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Fetch assignments for the course
    const { data: assignments, isLoading } = useQuery({
        queryKey: ['course-assignments', courseId],
        queryFn: async () => {
            const res = await api.get(`/assignments/courses/${courseId}/assignments`);
            return res.data.data as Assignment[];
        },
    });

    // Toggle assignment completion
    const toggleMutation = useMutation({
        mutationFn: async (assignmentId: string) => {
            const res = await api.patch(`/assignments/${assignmentId}/progress`);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['course-assignments', courseId] });
            queryClient.invalidateQueries({ queryKey: ['student-progress'] });
            queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
        },
    });

    const handleToggle = (assignmentId: string) => {
        toggleMutation.mutate(assignmentId);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    const completedCount = assignments?.filter((a) => a.isCompleted).length || 0;
    const totalCount = assignments?.length || 0;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="p-6">
            {/* Progress Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Course Assignments</h2>
                    <Badge className="bg-blue-100 text-blue-700 text-sm">
                        {completedCount}/{totalCount} Completed
                    </Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercentage)}% Complete</p>
            </div>

            {/* Assignment List */}
            <div className="space-y-3">
                {assignments && assignments.length > 0 ? (
                    assignments.map((assignment, index) => (
                        <motion.div
                            key={assignment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`hover:shadow-md transition-all cursor-pointer border-2 ${selectedId === assignment.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedId(assignment.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(assignment.id);
                                            }}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${assignment.isCompleted
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-300 hover:border-blue-500'
                                                }`}
                                            disabled={toggleMutation.isPending}
                                        >
                                            {assignment.isCompleted && (
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            )}
                                        </button>

                                        {/* Order Number */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{assignment.order}</span>
                                        </div>

                                        {/* Assignment Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className={`font-semibold text-gray-900 mb-1 ${assignment.isCompleted ? 'line-through text-gray-500' : ''
                                                    }`}
                                            >
                                                {assignment.title}
                                            </h3>
                                            {assignment.description && (
                                                <p className="text-sm text-gray-600 truncate">{assignment.description}</p>
                                            )}
                                        </div>

                                        {/* Status Badge */}
                                        <div>
                                            {assignment.isCompleted ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    Completed
                                                </Badge>
                                            ) : assignment.status === 'IN_PROGRESS' ? (
                                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                                    In Progress
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                                    Not Started
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No assignments found for this course</p>
                    </div>
                )}
            </div>
        </div>
    );
}
