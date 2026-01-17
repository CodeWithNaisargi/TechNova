import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PriceEditor } from '@/components/admin/PriceEditor';
import { Trash2, Edit, Eye, EyeOff, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function CourseManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch all courses for admin
    const { data: courses, isLoading } = useQuery({
        queryKey: ['admin-courses', searchTerm, selectedCategory],
        queryFn: async () => {
            const res = await api.get('/admin/courses', {
                params: {
                    search: searchTerm || undefined,
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                },
            });
            return res.data.data;
        },
    });

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ['courses', 'categories'],
        queryFn: async () => {
            const res = await api.get('/courses/categories');
            return res.data.data;
        },
    });

    // Toggle publish status
    const togglePublishMutation = useMutation({
        mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
            const res = await api.patch(`/admin/courses/${id}/publish`, {
                isPublished: !isPublished,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            toast({
                title: 'Success',
                description: 'Course status updated',
            });
        },
    });

    // Delete course
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/admin/courses/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            toast({
                title: 'Success',
                description: 'Course deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete course',
                variant: 'destructive',
            });
        },
    });

    const handleDelete = (courseId: string, courseTitle: string) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
            deleteMutation.mutate(courseId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Course Management</h1>
                    <p className="text-muted-foreground mt-1">Manage all courses and their settings</p>
                </div>
                <Link to="/admin/courses/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Course
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Categories</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name} ({cat.count})
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Courses Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Courses ({courses?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-semibold">Course</th>
                                    <th className="text-left p-3 font-semibold">Category</th>
                                    <th className="text-left p-3 font-semibold">Price</th>
                                    <th className="text-left p-3 font-semibold">Status</th>
                                    <th className="text-left p-3 font-semibold">Enrollments</th>
                                    <th className="text-right p-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No courses found
                                        </td>
                                    </tr>
                                ) : (
                                    courses?.map((course: any) => (
                                        <tr key={course.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {course.thumbnail && (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                                                            alt={course.title}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">{course.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            by {course.instructor?.name || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="outline">{course.category}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <PriceEditor courseId={course.id} initialPrice={course.price} />
                                            </td>
                                            <td className="p-3">
                                                <Button
                                                    size="sm"
                                                    variant={course.isPublished ? 'default' : 'outline'}
                                                    onClick={() =>
                                                        togglePublishMutation.mutate({
                                                            id: course.id,
                                                            isPublished: course.isPublished,
                                                        })
                                                    }
                                                    className="min-w-[100px]"
                                                >
                                                    {course.isPublished ? (
                                                        <>
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Published
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3 mr-1" />
                                                            Draft
                                                        </>
                                                    )}
                                                </Button>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-medium">{course._count?.enrollments || 0}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2 justify-end">
                                                    <Link to={`/admin/courses/edit/${course.id}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(course.id, course.title)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
