import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    FileText,
    CheckCircle,
    XCircle,
    Eye,
    Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import api from '@/services/api';
import { useSocket } from '@/hooks/useSocket';

const InstructorSubmissions = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [feedback, setFeedback] = useState('');
    const [grade, setGrade] = useState('');

    // Fetch submissions
    const { data: submissions, isLoading, refetch } = useQuery({
        queryKey: ['instructor', 'submissions', statusFilter],
        queryFn: async () => {
            const params = statusFilter !== 'all' ? `?status=${statusFilter.toUpperCase()}` : '';
            const res = await api.get(`/instructor/submissions${params}`);
            return res.data.data;
        },
    });

    // Listen for real-time submission updates
    useSocket('submission:created', (data: any) => {
        console.log('New submission received:', data);
        refetch();
        toast({
            title: 'New Submission!',
            description: `${data.studentName} submitted ${data.assignmentTitle}`,
        });
    });

    useSocket('submission:updated', () => {
        console.log('Submission updated');
        refetch();
    });

    useSocket('submission:graded', (data: any) => {
        console.log('Submission graded:', data);
        refetch();
    });

    // Update submission mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, status, feedback, grade }: any) => {
            const res = await api.patch(`/instructor/submissions/${id}`, {
                status,
                feedback,
                grade,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor', 'submissions'] });
            queryClient.invalidateQueries({ queryKey: ['instructor', 'stats'] });
            setSelectedSubmission(null);
            setFeedback('');
            setGrade('');
            toast({
                title: 'Success!',
                description: 'Submission updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update submission',
                variant: 'destructive',
            });
        },
    });

    const handleApprove = () => {
        if (!selectedSubmission) return;
        updateMutation.mutate({
            id: selectedSubmission.id,
            status: 'APPROVED',
            feedback,
            grade: grade || null,
        });
    };

    const handleReject = () => {
        if (!selectedSubmission || !feedback) {
            toast({
                title: 'Error',
                description: 'Please provide feedback for rejection',
                variant: 'destructive',
            });
            return;
        }
        updateMutation.mutate({
            id: selectedSubmission.id,
            status: 'REJECTED',
            feedback,
            grade: null,
        });
    };

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5001';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Submission Review</h1>
                    <p className="text-slate-600">Review and grade student submissions</p>
                </motion.div>

                {/* Filter */}
                <div className="mb-6">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Submissions</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submissions Grid */}
                {submissions && submissions.length > 0 ? (
                    <div className="grid gap-6">
                        {submissions.map((submission: any, index: number) => (
                            <motion.div
                                key={submission.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{submission.assignment?.title}</CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {submission.assignment?.course?.title}
                                                </p>
                                                <p className="text-sm font-medium mt-2">
                                                    Student: {submission.student?.name}
                                                </p>
                                            </div>
                                            <Badge
                                                className={
                                                    submission.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : submission.status === 'APPROVED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                }
                                            >
                                                {submission.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Submission File */}
                                            <div>
                                                <p className="text-sm font-medium mb-2">Submitted File:</p>
                                                <a
                                                    href={`${baseUrl}${submission.fileUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Submission
                                                </a>
                                            </div>

                                            {/* Existing Feedback/Grade */}
                                            {submission.feedback && (
                                                <div className="p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Feedback:</p>
                                                    <p className="text-sm text-slate-700">{submission.feedback}</p>
                                                </div>
                                            )}

                                            {submission.grade !== null && submission.grade !== undefined && (
                                                <div className="p-3 bg-green-50 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Grade:</p>
                                                    <p className="text-2xl font-bold text-green-700">{submission.grade}/100</p>
                                                </div>
                                            )}

                                            {/* Review Actions */}
                                            {submission.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedSubmission(submission);
                                                            setFeedback(submission.feedback || '');
                                                            setGrade(submission.grade?.toString() || '');
                                                        }}
                                                        variant="outline"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Review
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No Submissions Found
                            </h3>
                            <p className="text-slate-600">
                                {statusFilter !== 'all'
                                    ? `No ${statusFilter} submissions at the moment`
                                    : 'No submissions yet'}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Review Modal */}
                {selectedSubmission && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-4">Review Submission</h2>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Student</p>
                                        <p className="text-lg font-semibold">{selectedSubmission.student?.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Assignment</p>
                                        <p className="text-lg font-semibold">{selectedSubmission.assignment?.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Grade (0-100)
                                        </label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            placeholder="Enter grade"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Feedback
                                        </label>
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Provide feedback to the student..."
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleApprove}
                                        disabled={updateMutation.isPending}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={updateMutation.isPending}
                                        variant="destructive"
                                        className="flex-1"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedSubmission(null);
                                            setFeedback('');
                                            setGrade('');
                                        }}
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorSubmissions;
