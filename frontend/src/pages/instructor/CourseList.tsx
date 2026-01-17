import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    category: string;
    isPublished: boolean;
    sections: Array<{ lessons: Array<{ id: string }> }>;
    enrollments: Array<{ id: string }>;
}

const CourseList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

    const { data: courses, isLoading } = useQuery({
        queryKey: ['instructor-courses'],
        queryFn: async () => {
            const res = await api.get('/instructor/courses');
            return res.data.data as Course[];
        }
    });

    const togglePublishMutation = useMutation({
        mutationFn: async (courseId: string) => {
            const res = await api.patch(`/instructor/courses/${courseId}/publish`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
            toast({ title: 'Success', description: 'Course status updated' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (courseId: string) => {
            const res = await api.delete(`/courses/${courseId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
            toast({ title: 'Success', description: 'Course deleted' });
            setDeleteDialogOpen(false);
            setCourseToDelete(null);
        }
    });

    const handleDelete = (courseId: string) => {
        setCourseToDelete(courseId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (courseToDelete) {
            deleteMutation.mutate(courseToDelete);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
<<<<<<< HEAD
        <div className="space-y-6">
            <div className="flex items-center justify-between pt-6">
=======
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 sm:pt-6">
>>>>>>> 6b0f6c510c3e809ce1b5a3b7d7701b384f986c9d
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Courses</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage your courses and content</p>
                </div>
                <Link to="/instructor/courses/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Button>
                </Link>
            </div>

            {courses && courses.length > 0 ? (
                <div className="border border-border rounded-lg overflow-x-auto bg-card -mx-4 sm:mx-0">
                    <div className="min-w-[800px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary">
                                    <TableHead className="min-w-[200px] sm:min-w-[300px]">Course</TableHead>
                                    <TableHead className="text-center min-w-[100px] sm:min-w-[120px]">Category</TableHead>
                                    <TableHead className="text-center min-w-[80px] sm:min-w-[100px]">Price</TableHead>
                                    <TableHead className="text-center min-w-[80px] sm:min-w-[100px]">Students</TableHead>
                                    <TableHead className="text-center min-w-[80px] sm:min-w-[100px]">Lessons</TableHead>
                                    <TableHead className="text-center min-w-[100px] sm:min-w-[120px]">Status</TableHead>
                                    <TableHead className="text-center min-w-[120px] sm:min-w-[140px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="py-4">
                                        <div className="flex items-start gap-3 min-w-0">
                                            {course.thumbnail && (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${course.thumbnail.startsWith('/') ? course.thumbnail : '/' + course.thumbnail}`}
                                                    alt={course.title}
                                                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-foreground break-words">{course.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-2 mt-1 break-words">
                                                    {course.description}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge variant="secondary">{course.category}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </TableCell>
                                    <TableCell className="text-center">{course.enrollments?.length || 0}</TableCell>
                                    <TableCell className="text-center">
                                        {course.sections?.reduce((sum, s) => sum + (s.lessons?.length || 0), 0) || 0}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => togglePublishMutation.mutate(course.id)}
                                            >
                                                {course.isPublished ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(course.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No courses yet</p>
                        <Link to="/instructor/courses/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Course
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this course? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseList;

