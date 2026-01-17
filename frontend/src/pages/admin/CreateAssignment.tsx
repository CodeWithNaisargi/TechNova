import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileText, Calendar } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export default function CreateAssignment() {
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        description: '',
        dueDate: '',
        maxScore: '',
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch courses for dropdown
    const { data: courses } = useQuery({
        queryKey: ['admin-courses'],
        queryFn: async () => {
            const res = await api.get('/admin/courses');
            return res.data.data;
        },
    });

    // Create assignment mutation
    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await api.post(`/courses/${data.courseId}/assignments`, {
                title: data.title,
                description: data.description,
                dueDate: new Date(data.dueDate).toISOString(),
                maxScore: parseInt(data.maxScore),
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast({ title: 'Success', description: 'Assignment created successfully' });
            navigate('/admin/assignments');
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create assignment',
                variant: 'destructive',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.courseId || !formData.title || !formData.dueDate || !formData.maxScore) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            return;
        }

        createMutation.mutate(formData);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create Assignment</h1>
                <p className="text-muted-foreground mt-1">Add a new assignment to a course</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Assignment Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="course">Course *</Label>
                            <Select
                                value={formData.courseId}
                                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses?.map((course: any) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="title">Assignment Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Week 1 Quiz"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the assignment requirements..."
                                rows={5}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dueDate">Due Date *</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="dueDate"
                                        type="datetime-local"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="maxScore">Maximum Score *</Label>
                                <Input
                                    id="maxScore"
                                    type="number"
                                    value={formData.maxScore}
                                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                                    placeholder="100"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/dashboard')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex-1"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
