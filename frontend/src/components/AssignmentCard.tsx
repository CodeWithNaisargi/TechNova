import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Video, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentCardProps {
    assignment: {
        id: string;
        title: string;
        description?: string;
        order: number;
        dueDate?: string;
        videoUrl?: string;
        attachmentUrl?: string;
    };
    progress?: {
        status: string;
    };
    submission?: {
        status: string;
        grade?: number;
        feedback?: string;
    };
    courseId: string;
}

const AssignmentCard = ({ assignment, progress, submission, courseId }: AssignmentCardProps) => {
    const getStatusBadge = () => {
        if (submission) {
            switch (submission.status) {
                case 'APPROVED':
                    return (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approved
                        </Badge>
                    );
                case 'REJECTED':
                    return (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                            <XCircle className="w-3 h-3 mr-1" />
                            Rejected
                        </Badge>
                    );
                case 'PENDING':
                    return (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Under Review
                        </Badge>
                    );
            }
        }

        if (progress) {
            switch (progress.status) {
                case 'SUBMITTED':
                    return (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Submitted
                        </Badge>
                    );
                case 'COMPLETED':
                    return (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                        </Badge>
                    );
                case 'IN_PROGRESS':
                    return (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            <Clock className="w-3 h-3 mr-1" />
                            In Progress
                        </Badge>
                    );
                default:
                    return (
                        <Badge className="bg-slate-100 text-slate-800 border-slate-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Started
                        </Badge>
                    );
            }
        }

        return (
            <Badge className="bg-slate-100 text-slate-800 border-slate-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Started
            </Badge>
        );
    };

    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !submission;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card className={`hover:shadow-lg transition-all duration-300 ${isOverdue ? 'border-red-300 bg-red-50/30' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                                    Assignment #{assignment.order}
                                </span>
                                {getStatusBadge()}
                            </div>
                            <h3 className="font-bold text-lg leading-tight">{assignment.title}</h3>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-3">
                    {assignment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {assignment.description}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {assignment.dueDate && (
                            <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                        )}
                        {assignment.videoUrl && (
                            <div className="flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5" />
                                <span>Video included</span>
                            </div>
                        )}
                        {assignment.attachmentUrl && (
                            <div className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Attachment</span>
                            </div>
                        )}
                    </div>

                    {/* Grade Display */}
                    {submission?.grade !== undefined && submission.status === 'APPROVED' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-900">Grade</span>
                                <span className="text-2xl font-bold text-green-700">{submission.grade}/100</span>
                            </div>
                            {submission.feedback && (
                                <p className="text-xs text-green-800 mt-2 italic">"{submission.feedback}"</p>
                            )}
                        </div>
                    )}

                    {/* Rejection Feedback */}
                    {submission?.status === 'REJECTED' && submission.feedback && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs font-medium text-red-900 mb-1">Feedback:</p>
                            <p className="text-xs text-red-800 italic">"{submission.feedback}"</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-3 border-t">
                    <Link to={`/assignments/${assignment.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                            {submission ? 'View Submission' : 'Start Assignment'}
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default AssignmentCard;
