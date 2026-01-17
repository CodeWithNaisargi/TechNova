import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Types
interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    category: string;
    tags: string[];
    difficulty: string;
    isPublished: boolean;
    instructor: {
        id: string;
        name: string;
    };
}

interface Category {
    name: string;
    count: number;
}

// Hook to fetch popular courses
export const usePopularCourses = (limit?: number) => {
    return useQuery<Course[]>({
        queryKey: ['courses', 'popular', limit],
        queryFn: async () => {
            const res = await api.get('/courses/popular', {
                params: { limit },
            });
            return res.data.data;
        },
    });
};

// Hook to fetch new/recent courses
export const useNewCourses = (limit?: number) => {
    return useQuery<Course[]>({
        queryKey: ['courses', 'new', limit],
        queryFn: async () => {
            const res = await api.get('/courses/new', {
                params: { limit },
            });
            return res.data.data;
        },
    });
};

// Hook to fetch course categories
export const useCourseCategories = () => {
    return useQuery<Category[]>({
        queryKey: ['courses', 'categories'],
        queryFn: async () => {
            const res = await api.get('/courses/categories');
            return res.data.data;
        },
    });
};

// Hook to fetch all courses with optional filters
export const useCourses = (filters?: {
    category?: string;
    search?: string;
    difficulty?: string;
}) => {
    return useQuery<Course[]>({
        queryKey: ['courses', 'all', filters],
        queryFn: async () => {
            const res = await api.get('/courses', {
                params: filters,
            });
            return res.data.data;
        },
    });
};

// Hook to fetch a single course by ID
export const useCourse = (courseId: string) => {
    return useQuery<Course>({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data.data;
        },
        enabled: !!courseId,
    });
};

// Hook to enroll in a course
export const useEnrollCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseId: string) => {
            const res = await api.post('/enrollments', { courseId });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
        },
    });
};
