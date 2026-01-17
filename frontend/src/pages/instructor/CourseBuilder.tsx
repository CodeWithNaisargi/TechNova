import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { AddSectionModal } from '@/components/instructor/modals/AddSectionModal';
import { AddLessonModal } from '@/components/instructor/modals/AddLessonModal';

const CourseBuilder = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    // Modal state management
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [lessonModalOpen, setLessonModalOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string>('');
    const [selectedSectionLessonCount, setSelectedSectionLessonCount] = useState(0);

    // ---------- FIXED TYPE ----------
    const [sections, setSections] = useState<
        Array<{
            id: string;
            title: string;
            order: number;
            lessons: Array<{
                id: string;
                title: string;
                videoUrl: string;
                isFree: boolean;
                order: number;
            }>;
        }>
    >([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '0',
        tags: '',
        thumbnail: null as File | null
    });

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data.data;
        },
        enabled: isEdit
    });

    // Update form data when course is loaded
    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                category: course.category || '',
                price: course.price?.toString() || '0',
                tags: course.tags?.join(', ') || '',
                thumbnail: null
            });
            setSections(course.sections || []);
        }
    }, [course]);

    const saveCourseMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (isEdit) {
                return api.put(`/courses/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                return api.post('/courses', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
        },
        onSuccess: (response) => {
            const courseId = response.data.data.id;
            toast({
                title: 'Success',
                description: `Course ${isEdit ? 'updated' : 'created'} successfully!`
            });
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
            navigate(`/instructor/courses/${courseId}/edit`);
        }
    });



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('tags', formData.tags);

        if (formData.thumbnail) {
            formDataToSend.append('thumbnail', formData.thumbnail);
        }

        saveCourseMutation.mutate(formDataToSend);
    };

    const handleAddSection = () => {
        if (!id) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please save the course first'
            });
            return;
        }
        setSectionModalOpen(true);
    };

    const handleAddLesson = (sectionId: string) => {
        const section = sections.find((s) => s.id === sectionId) ||
            course?.sections?.find((s: any) => s.id === sectionId);

        setSelectedSectionId(sectionId);
        setSelectedSectionLessonCount(section?.lessons?.length || 0);
        setLessonModalOpen(true);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {isEdit ? 'Edit Course' : 'Create Course'}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })
                                }
                                rows={5}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                placeholder="React, JavaScript, Web Development"
                            />
                        </div>

                        <div>
                            <Label htmlFor="thumbnail">Thumbnail</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        thumbnail: e.target.files?.[0] || null
                                    })
                                }
                            />
                        </div>

                        <Button type="submit" disabled={saveCourseMutation.isPending}>
                            {saveCourseMutation.isPending
                                ? 'Saving...'
                                : isEdit
                                    ? 'Update Course'
                                    : 'Create Course'}
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Add Section Modal */}
            {id && (
                <AddSectionModal
                    open={sectionModalOpen}
                    onClose={() => setSectionModalOpen(false)}
                    courseId={id}
                />
            )}

            {/* Add Lesson Modal */}
            {id && selectedSectionId && (
                <AddLessonModal
                    open={lessonModalOpen}
                    onClose={() => setLessonModalOpen(false)}
                    sectionId={selectedSectionId}
                    courseId={id}
                    currentLessonCount={selectedSectionLessonCount}
                />
            )}

            {isEdit && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Course Content</CardTitle>
                            <Button onClick={handleAddSection}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Section
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {(course?.sections || sections).map((section: any) => (
                            <Card key={section.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-4">
                                        {section.lessons?.map((lesson: any) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-2 border rounded"
                                            >
                                                <span>{lesson.title}</span>
                                                {lesson.isFree && (
                                                    <span className="text-xs text-green-600">
                                                        Free Preview
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddLesson(section.id)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Lesson
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CourseBuilder;
