import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Video, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import { format } from 'date-fns';

const AssignmentDetails = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Fetch assignment details
    const { data: assignment, isLoading } = useQuery({
        queryKey: ['assignment', assignmentId],
        queryFn: async () => {
            const res = await api.get(`/assignments/${assignmentId}`);
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

    const mySubmission = submissions?.find(
        (s: any) => s.assignment.id === assignmentId
    );

    // Submit assignment mutation
    const submitMutation = useMutation({
        mutationFn: async (fileUrl: string) => {
            const res = await api.post('/submissions', {
                assignmentId,
                fileUrl,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            toast({
                title: 'Success!',
                description: 'Assignment submitted successfully',
            });
            setSelectedFile(null);
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to submit assignment',
                variant: 'destructive',
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast({
                title: 'Error',
                description: 'Please select a file to upload',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);
        try {
            // Upload file
            const formData = new FormData();
            formData.append('attachment', selectedFile);

            const uploadRes = await api.post('/attachments/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const fileUrl = uploadRes.data.data.url;

            // Submit assignment
            await submitMutation.mutateAsync(fileUrl);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to upload file',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading assignment...</p>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Assignment Not Found</h2>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5001';
    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !mySubmission;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <Card className="border-2 border-slate-100 shadow-lg">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline">Assignment #{assignment.order}</Badge>
                                        {mySubmission && (
                                            <Badge className={
                                                mySubmission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    mySubmission.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }>
                                                {mySubmission.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {mySubmission.status}
                                            </Badge>
                                        )}
                                        {isOverdue && (
                                            <Badge className="bg-red-100 text-red-800">
                                                Overdue
                                            </Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                        {assignment.title}
                                    </h1>
                                    <p className="text-slate-600">
                                        {assignment.course?.title}
                                    </p>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                                {assignment.dueDate && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                                            Due: {format(new Date(assignment.dueDate), 'MMMM dd, yyyy')}
                                        </span>
                                    </div>
                                )}
                                {assignment.videoUrl && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Video className="w-4 h-4 text-muted-foreground" />
                                        <span>Video Tutorial Available</span>
                                    </div>
                                )}
                                {assignment.attachmentUrl && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        <span>Reference Material Attached</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Assignment Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Description */}
                    {assignment.description && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold">Description</h2>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 whitespace-pre-wrap">{assignment.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Content */}
                    {assignment.content && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold">Instructions</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-700 whitespace-pre-wrap">{assignment.content}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Video */}
                    {assignment.videoUrl && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Video className="w-5 h-5" />
                                    Video Tutorial
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <video
                                    controls
                                    className="w-full rounded-lg"
                                    src={`${baseUrl}${assignment.videoUrl}`}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </CardContent>
                        </Card>
                    )}

                    {/* Attachment */}
                    {assignment.attachmentUrl && (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Reference Material
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <a
                                    href={`${baseUrl}${assignment.attachmentUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Download Attachment
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submission Section */}
                    {mySubmission ? (
                        <Card className={
                            mySubmission.status === 'APPROVED' ? 'border-green-200 bg-green-50/50' :
                                mySubmission.status === 'REJECTED' ? 'border-red-200 bg-red-50/50' :
                                    'border-yellow-200 bg-yellow-50/50'
                        }>
                            <CardHeader>
                                <h2 className="text-xl font-bold">Your Submission</h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Submitted File:</p>
                                    <a
                                        href={`${baseUrl}${mySubmission.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        View Submission
                                    </a>
                                </div>

                                {mySubmission.status === 'APPROVED' && mySubmission.grade !== undefined && (
                                    <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-green-900">Grade</span>
                                            <span className="text-3xl font-bold text-green-700">{mySubmission.grade}/100</span>
                                        </div>
                                        {mySubmission.feedback && (
                                            <p className="text-sm text-green-800 italic">"{mySubmission.feedback}"</p>
                                        )}
                                    </div>
                                )}

                                {mySubmission.status === 'REJECTED' && mySubmission.feedback && (
                                    <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                                        <p className="font-semibold text-red-900 mb-2">Feedback:</p>
                                        <p className="text-sm text-red-800 italic">"{mySubmission.feedback}"</p>
                                        <p className="text-sm text-red-700 mt-3">Please resubmit your work.</p>
                                    </div>
                                )}

                                {mySubmission.status === 'PENDING' && (
                                    <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            Your submission is under review. You'll be notified once it's graded.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Submit Assignment
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Upload your work
                                    </label>
                                    <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                    />
                                    {selectedFile && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Selected: {selectedFile.name}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedFile || uploading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Submit Assignment
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AssignmentDetails;
