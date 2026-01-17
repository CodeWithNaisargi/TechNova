import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Circle, Play, Download, ChevronRight } from 'lucide-react';
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

const LearningPlayer = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: course, isLoading } = useQuery({
        queryKey: ['course-learning', courseId],
        queryFn: async () => {
            const res = await api.get(`/student/learning/${courseId}`);
            return res.data.data as Course;
        }
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
            queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
        }
    });

    useEffect(() => {
        if (course && !selectedLessonId) {
            // Find first incomplete lesson or last accessed
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

    const calculateProgress = () => {
        if (!course) return 0;
        const allLessons = course.sections.flatMap(s => s.lessons);
        const completed = allLessons.filter(l => l.progress?.[0]?.isCompleted).length;
        return allLessons.length > 0 ? (completed / allLessons.length) * 100 : 0;
    };

    if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
    if (!course) return <div className="container mx-auto px-4 py-8">Course not found or not enrolled</div>;

    const progress = calculateProgress();

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className="w-80 border-r bg-slate-50 overflow-y-auto">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                    <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => navigate(`/courses/${courseId}/assignments`)}
                        >
                            View Assignments
                        </Button>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {course.sections.map(section => (
                        <div key={section.id}>
                            <h3 className="font-semibold mb-2">{section.title}</h3>
                            <div className="space-y-1">
                                {section.lessons.map(lesson => {
                                    const isCompleted = lesson.progress?.[0]?.isCompleted;
                                    const isSelected = lesson.id === selectedLessonId;
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setSelectedLessonId(lesson.id)}
                                            className={`w-full text-left p-2 rounded flex items-center gap-2 hover:bg-slate-100 transition-colors ${isSelected ? 'bg-slate-200 font-medium' : ''
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            )}
                                            <span className="flex-1 text-sm">{lesson.title}</span>
                                            {lesson.isFree && (
                                                <Badge variant="secondary" className="text-xs">Free</Badge>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedLesson ? (
                    <>
                        <div className="p-6 border-b bg-white">
                            <h1 className="text-2xl font-bold mb-2">{selectedLesson.title}</h1>
                            {selectedLesson.description && (
                                <p className="text-muted-foreground">{selectedLesson.description}</p>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto bg-black">
                            <div className="aspect-video bg-black flex items-center justify-center">
                                {selectedLesson.videoUrl ? (
                                    <iframe
                                        src={selectedLesson.videoUrl}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={selectedLesson.title}
                                    />
                                ) : (
                                    <div className="text-white">Video URL not available</div>
                                )}
                            </div>
                        </div>
                        <div className="p-6 border-t bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-2">
                                    {selectedLesson.attachments.map(attachment => (
                                        <a
                                            key={attachment.id}
                                            href={`http://localhost:5001${attachment.url}`}
                                            download
                                            className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-slate-50"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="text-sm">{attachment.name}</span>
                                        </a>
                                    ))}
                                </div>
                                <Button
                                    onClick={handleLessonComplete}
                                    disabled={selectedLesson.progress?.[0]?.isCompleted}
                                >
                                    {selectedLesson.progress?.[0]?.isCompleted ? 'Completed' : 'Mark as Complete'}
                                </Button>
                            </div>
                            {/* Navigation */}
                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const allLessons = course.sections.flatMap(s => s.lessons);
                                        const currentIndex = allLessons.findIndex(l => l.id === selectedLessonId);
                                        if (currentIndex > 0) {
                                            setSelectedLessonId(allLessons[currentIndex - 1].id);
                                        }
                                    }}
                                >
                                    Previous Lesson
                                </Button>
                                <Button
                                    onClick={() => {
                                        const allLessons = course.sections.flatMap(s => s.lessons);
                                        const currentIndex = allLessons.findIndex(l => l.id === selectedLessonId);
                                        if (currentIndex < allLessons.length - 1) {
                                            setSelectedLessonId(allLessons[currentIndex + 1].id);
                                        }
                                    }}
                                >
                                    Next Lesson
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a lesson to start learning
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPlayer;

