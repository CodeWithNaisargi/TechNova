import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Types
interface Certificate {
    id: string;
    userId: string;
    courseId: string;
    courseName: string;
    studentName: string;
    certificateId: string;
    issueDate: string;
    completionPercentage: number;
    createdAt: string;
}

interface GenerateCertificateResponse {
    success: boolean;
    data: Certificate;
    message: string;
}

// Hook to fetch user's certificates
export const useCertificates = () => {
    return useQuery<Certificate[]>({
        queryKey: ['certificates', 'my'],
        queryFn: async () => {
            const res = await api.get('/certificates/my-certificates');
            return res.data.data;
        },
    });
};

// Hook to generate certificate for a course
export const useGenerateCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation<GenerateCertificateResponse, Error, string>({
        mutationFn: async (courseId: string) => {
            const res = await api.post(`/certificates/generate/${courseId}`);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate certificates and dashboard queries
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
            queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
        },
    });
};

// Hook to fetch a specific certificate by its certificate ID
export const useCertificateById = (certificateId: string) => {
    return useQuery<Certificate>({
        queryKey: ['certificate', certificateId],
        queryFn: async () => {
            const res = await api.get(`/certificates/${certificateId}`);
            return res.data.data;
        },
        enabled: !!certificateId,
    });
};

// Hook to verify a certificate (public, no auth required)
export const useVerifyCertificate = (certificateId: string) => {
    return useQuery({
        queryKey: ['certificate', 'verify', certificateId],
        queryFn: async () => {
            const res = await api.get(`/certificates/verify/${certificateId}`);
            return res.data.data;
        },
        enabled: !!certificateId,
    });
};
