import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Types
interface Assignment {
    id: string;
    title: string;
    description?: string;
    order: number;
    dueDate?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED';
    completedAt?: string;
}

interface AssignmentProgress {
    courseId: string;
    courseTitle: string;
    courseThumbnail?: string;
    totalAssignments: number;
    completedAssignments: number;
    progressPercentage: number;
}

// Hook to fetch assignments for a specific course
export const useAssignments = (courseId: string) => {
    return useQuery<Assignment[]>({
        queryKey: ['course-assignments', courseId],
        queryFn: async () => {
            const res = await api.get(`/assignments/courses/${courseId}/assignments`);
            return res.data.data;
        },
        enabled: !!courseId,
    });
};

// Hook to toggle assignment completion status
export const useToggleAssignment = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (assignmentId: string) => {
            const res = await api.patch(`/assignments/${assignmentId}/progress`);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['course-assignments', courseId] });
            queryClient.invalidateQueries({ queryKey: ['student-progress'] });
            queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
        },
    });
};

// Hook to fetch overall assignment progress across all courses
export const useAssignmentProgress = () => {
    return useQuery<AssignmentProgress[]>({
        queryKey: ['student-progress'],
        queryFn: async () => {
            const res = await api.get('/assignments/progress');
            return res.data.data || [];
        },
    });
};
