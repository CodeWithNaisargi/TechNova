import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileText, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface Submission {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    grade?: number;
    feedback?: string;
    fileUrl: string;
    submittedAt: string;
    student: {
        id: string;
        name: string;
        email: string;
    };
    assignment: {
        id: string;
        title: string;
        maxScore: number;
        course: {
            title: string;
        };
    };
}

export default function SubmissionsReview() {
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';

    const [selectedStatus, setSelectedStatus] = useState(statusFilter);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch submissions
    const { data: submissions, isLoading } = useQuery({
        queryKey: ['admin-submissions', selectedStatus],
        queryFn: async () => {
            const res = await api.get('/submissions');
            let data = res.data.data as Submission[];

            if (selectedStatus !== 'all') {
                data = data.filter(s => s.status === selectedStatus);
            }

            return data;
        },
    });

    // Grade submission mutation
    const gradeMutation = useMutation({
        mutationFn: async ({ id, grade, feedback, status }: { id: string; grade?: number; feedback?: string; status: string }) => {
            const res = await api.patch(`/submissions/${id}/status`, {
                grade,
                feedback,
                status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
            toast({ title: 'Success', description: 'Submission reviewed successfully' });
            setReviewModalOpen(false);
            setSelectedSubmission(null);
            setGrade('');
            setFeedback('');
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to review submission',
                variant: 'destructive',
            });
        },
    });

    const handleReview = (submission: Submission) => {
        setSelectedSubmission(submission);
        setGrade(submission.grade?.toString() || '');
        setFeedback(submission.feedback || '');
        setReviewModalOpen(true);
    };

    const handleApprove = () => {
        if (!selectedSubmission) return;
        gradeMutation.mutate({
            id: selectedSubmission.id,
            grade: grade ? parseFloat(grade) : undefined,
            feedback,
            status: 'APPROVED',
        });
    };

    const handleReject = () => {
        if (!selectedSubmission) return;
        gradeMutation.mutate({
            id: selectedSubmission.id,
            feedback,
            status: 'REJECTED',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'APPROVED':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Submissions Review</h1>
                <p className="text-muted-foreground mt-1">Review and grade student submissions</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Submissions</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submissions ({submissions?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!submissions || submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No submissions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">{submission.student.name}</TableCell>
                                        <TableCell>{submission.assignment.title}</TableCell>
                                        <TableCell>{submission.assignment.course.title}</TableCell>
                                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                                        <TableCell>
                                            {submission.grade !== null && submission.grade !== undefined
                                                ? `${submission.grade}/${submission.assignment.maxScore}`
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(submission.submittedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => window.open(submission.fileUrl, '_blank')}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleReview(submission)}
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Review Modal */}
            <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Submission</DialogTitle>
                        <DialogDescription>
                            Student: {selectedSubmission?.student.name} | Assignment: {selectedSubmission?.assignment.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Submission File</Label>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => window.open(selectedSubmission?.fileUrl, '_blank')}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Submission
                            </Button>
                        </div>
                        <div>
                            <Label htmlFor="grade">Grade (Max: {selectedSubmission?.assignment.maxScore})</Label>
                            <Input
                                id="grade"
                                type="number"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="Enter grade"
                                max={selectedSubmission?.assignment.maxScore}
                            />
                        </div>
                        <div>
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide feedback to the student..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={gradeMutation.isPending}
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={gradeMutation.isPending}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
