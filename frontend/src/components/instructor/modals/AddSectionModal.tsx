import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

interface AddSectionModalProps {
    open: boolean;
    onClose: () => void;
    courseId: string;
}

export function AddSectionModal({ open, onClose, courseId }: AddSectionModalProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        order: ''
    });

    const addSectionMutation = useMutation({
        mutationFn: async (data: { title: string; description?: string; order: number }) => {
            const res = await api.post(`/courses/${courseId}/sections`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
            toast({
                title: 'Success',
                description: 'Section added successfully!',
            });
            handleClose();
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to add section',
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Section title is required',
            });
            return;
        }

        addSectionMutation.mutate({
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            order: formData.order ? parseInt(formData.order) : 0
        });
    };

    const handleClose = () => {
        setFormData({ title: '', description: '', order: '' });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                    <DialogDescription>
                        Create a new section to organize your course content.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="section-title">
                                Section Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="section-title"
                                placeholder="e.g., Introduction to React"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="section-description">Description (Optional)</Label>
                            <Textarea
                                id="section-description"
                                placeholder="Brief description of what this section covers..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="section-order">Order (Optional)</Label>
                            <Input
                                id="section-order"
                                type="number"
                                min="0"
                                placeholder="Leave empty for auto-order"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty to add at the end
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={addSectionMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addSectionMutation.isPending}>
                            {addSectionMutation.isPending ? 'Adding...' : 'Add Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
