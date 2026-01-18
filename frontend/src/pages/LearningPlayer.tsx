import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Circle, Download, ChevronRight, FileText, Clock, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl: string;
    isFree: boolean;
    order: number;
    progress?: Array<{ isCompleted: boolean }>;
    attachments: Array<{
        id: string;
        name: string;
        url: string;
        type: string;
    }>;
}

interface Section {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    sections: Section[];
}

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    submissionStatus: string | null; // null, 'PENDING', 'APPROVED', 'REJECTED'
}

interface CourseProgress {
    totalAssignments: number;
    completedAssignments: number;
    progressPercentage: number;
    assignments: Assignment[];
}

const LearningPlayer = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch course data
    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ['course-learning', courseId],
        queryFn: async () => {
            const res = await api.get(`/student/learning/${courseId}`);
            return res.data.data as Course;
        },
        enabled: !!courseId
    });

    // Fetch course progress (assignment-based)
    const { data: progressData, isLoading: progressLoading } = useQuery({
        queryKey: ['course-progress', courseId],
        queryFn: async () => {
            const res = await api.get(`/student/course/${courseId}/progress`);
            return res.data.data as CourseProgress;
        },
        enabled: !!courseId
    });

    const selectedLesson = course?.sections
        .flatMap(s => s.lessons)
        .find(l => l.id === selectedLessonId);

    const progressMutation = useMutation({
        mutationFn: async ({ lessonId, isCompleted }: { lessonId: string; isCompleted: boolean }) => {
            const res = await api.post('/progress', { lessonId, isCompleted });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-learning', courseId] });
            queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] });
            queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
        }
    });

    useEffect(() => {
        if (course && !selectedLessonId) {
            const allLessons = course.sections.flatMap(s => s.lessons);
            const incomplete = allLessons.find(l => !l.progress?.[0]?.isCompleted);
            setSelectedLessonId(incomplete?.id || allLessons[0]?.id || null);
        }
    }, [course, selectedLessonId]);

    const handleLessonComplete = () => {
        if (selectedLessonId) {
            progressMutation.mutate({ lessonId: selectedLessonId, isCompleted: true });
            toast({ title: 'Progress saved', description: 'Lesson marked as complete!' });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get badge styling based on submission status
    const getAssignmentBadge = (assignment: Assignment) => {
        if (assignment.isCompleted) {
            return { text: 'Approved', className: 'bg-green-600 hover:bg-green-700 text-white' };
        }
        switch (assignment.submissionStatus) {
            case 'PENDING':
                return { text: 'Under Review', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' };
            case 'REJECTED':
                return { text: 'Rejected', className: 'bg-red-500 hover:bg-red-600 text-white' };
            default:
                return { text: 'Not Submitted', className: 'bg-slate-400 hover:bg-slate-500 text-white' };
        }
    };

    if (courseLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-lg text-muted-foreground">Course not found or not enrolled</p>
                </div>
            </div>
        );
    }

    const assignmentProgress = progressData?.progressPercentage || 0;

    return (
        <div className="h-full flex overflow-hidden bg-slate-50">
            {/* Left Sidebar - Course Navigation */}
            <div className="w-80 bg-white border-r flex flex-col h-full">
                {/* Course Header */}
                <div className="p-5 border-b bg-white">
                    <h2 className="font-bold text-lg text-slate-900 leading-tight mb-4">{course.title}</h2>

                    {/* Progress Card */}
                    <div className="bg-slate-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Assignment Progress</span>
                            <span className="text-lg font-bold text-slate-900">{assignmentProgress}%</span>
                        </div>
                        <Progress value={assignmentProgress} className="h-2" />
                        <p className="text-xs mt-2 text-slate-500">
                            {progressData?.completedAssignments || 0} / {progressData?.totalAssignments || 0} completed
                        </p>
                    </div>
                </div>

                {/* Lessons List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3">
                        {course.sections.map(section => (
                            <div key={section.id} className="mb-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 mb-2">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.lessons.map(lesson => {
                                        const isCompleted = lesson.progress?.[0]?.isCompleted;
                                        const isSelected = lesson.id === selectedLessonId;
                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setSelectedLessonId(lesson.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 ${isSelected
                                                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                                                    : 'hover:bg-slate-50 text-slate-700'
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <Circle className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-300'}`} />
                                                )}
                                                <span className="flex-1 text-sm font-medium truncate">{lesson.title}</span>
                                                {lesson.isFree && (
                                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Free</Badge>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedLesson ? (
                    <>
                        {/* Video Section */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 flex-shrink-0">
                            <div className="aspect-video max-h-[50vh] mx-auto">
                                {selectedLesson.videoUrl ? (
                                    <iframe
                                        src={selectedLesson.videoUrl}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={selectedLesson.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <div className="text-center">
                                            <BookOpen className="h-16 w-16 mx-auto mb-3 opacity-50" />
                                            <p>Video not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lesson Info & Controls */}
                        <div className="p-6 bg-white border-b flex-shrink-0">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedLesson.title}</h1>
                            {selectedLesson.description && (
                                <p className="text-slate-600 mb-4">{selectedLesson.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {selectedLesson.attachments.map(attachment => (
                                        <a
                                            key={attachment.id}
                                            href={`http://localhost:5001${attachment.url}`}
                                            download
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700"
                                        >
                                            <Download className="h-4 w-4" />
                                            {attachment.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const allLessons = course.sections.flatMap(s => s.lessons);
                                            const currentIndex = allLessons.findIndex(l => l.id === selectedLessonId);
                                            if (currentIndex > 0) setSelectedLessonId(allLessons[currentIndex - 1].id);
                                        }}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={handleLessonComplete}
                                        disabled={selectedLesson.progress?.[0]?.isCompleted}
                                        className={selectedLesson.progress?.[0]?.isCompleted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                                    >
                                        {selectedLesson.progress?.[0]?.isCompleted ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Completed
                                            </>
                                        ) : 'Mark Complete'}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const allLessons = course.sections.flatMap(s => s.lessons);
                                            const currentIndex = allLessons.findIndex(l => l.id === selectedLessonId);
                                            if (currentIndex < allLessons.length - 1) setSelectedLessonId(allLessons[currentIndex + 1].id);
                                        }}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Assignments Section Below Video */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-bold text-slate-900">Course Assignments</h2>
                                    <Badge variant="secondary" className="ml-auto">
                                        {progressData?.completedAssignments || 0}/{progressData?.totalAssignments || 0}
                                    </Badge>
                                </div>

                                {progressLoading ? (
                                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                                ) : progressData?.assignments && progressData.assignments.length > 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                        {progressData.assignments.map((assignment, idx) => (
                                            <div
                                                key={assignment.id}
                                                onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                                                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-blue-50 transition-colors ${idx !== 0 ? 'border-t' : ''
                                                    } ${assignment.isCompleted ? 'bg-green-50/50' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${assignment.isCompleted ? 'bg-green-100' : 'bg-slate-100'
                                                    }`}>
                                                    {assignment.isCompleted ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <FileText className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                                                    {assignment.description && (
                                                        <p className="text-sm text-slate-500 line-clamp-1">{assignment.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        Due: {formatDate(assignment.dueDate)}
                                                    </div>
                                                </div>
                                                <Badge className={getAssignmentBadge(assignment).className}>
                                                    {getAssignmentBadge(assignment).text}
                                                </Badge>
                                                <ChevronRight className="h-5 w-5 text-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border">
                                        <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                        <p className="text-slate-500">No assignments for this course</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* No Lesson Selected - Show Assignments Full Screen */
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
                        <div className="max-w-4xl mx-auto p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Course Assignments</h2>
                                <p className="text-slate-600">
                                    {progressData?.completedAssignments || 0} of {progressData?.totalAssignments || 0} assignments completed
                                </p>
                                <div className="w-64 mx-auto mt-4">
                                    <Progress value={assignmentProgress} className="h-3" />
                                </div>
                            </div>

                            {progressLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : progressData?.assignments && progressData.assignments.length > 0 ? (
                                <div className="space-y-3">
                                    {progressData.assignments.map((assignment) => (
                                        <div
                                            key={assignment.id}
                                            onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                                            className={`bg-white rounded-xl shadow-sm border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 ${assignment.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-100'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${assignment.isCompleted ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                    {assignment.isCompleted ? (
                                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                                    ) : (
                                                        <FileText className="h-6 w-6 text-blue-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-900">{assignment.title}</h3>
                                                            {assignment.description && (
                                                                <p className="text-slate-600 mt-1">{assignment.description}</p>
                                                            )}
                                                        </div>
                                                        <Badge className={`flex-shrink-0 ${getAssignmentBadge(assignment).className}`}>
                                                            {getAssignmentBadge(assignment).text}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Due: {formatDate(assignment.dueDate)}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-6 w-6 text-slate-300 flex-shrink-0 mt-3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
                                    <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                                    <p className="text-lg text-slate-500">No assignments for this course yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPlayer;
