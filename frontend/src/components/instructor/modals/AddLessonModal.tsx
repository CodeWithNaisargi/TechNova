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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X } from 'lucide-react';
import api from '@/services/api';

interface AddLessonModalProps {
    open: boolean;
    onClose: () => void;
    sectionId: string;
    courseId: string;
    currentLessonCount: number;
}

export function AddLessonModal({
    open,
    onClose,
    sectionId,
    courseId,
    currentLessonCount
}: AddLessonModalProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        isFree: false,
        duration: '',
        order: ''
    });
    const [attachment, setAttachment] = useState<File | null>(null);

    const addLessonMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const res = await api.post(`/courses/sections/${sectionId}/lessons`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
            toast({
                title: 'Success',
                description: 'Lesson added successfully!',
            });
            handleClose();
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to add lesson',
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Lesson title is required',
            });
            return;
        }

        if (!formData.videoUrl.trim()) {
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: 'Video URL is required',
            });
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('videoUrl', formData.videoUrl.trim());
        formDataToSend.append('isFree', formData.isFree.toString());
        formDataToSend.append('order', formData.order || (currentLessonCount + 1).toString());

        if (formData.duration) {
            formDataToSend.append('duration', formData.duration);
        }

        if (attachment) {
            formDataToSend.append('attachment', attachment);
        }

        // Debug logging
        console.log('=== Add Lesson Form Data ===');
        console.log('Title:', formData.title.trim());
        console.log('Description:', formData.description.trim());
        console.log('Video URL:', formData.videoUrl.trim());
        console.log('Is Free:', formData.isFree);
        console.log('Duration:', formData.duration);
        console.log('Order:', formData.order || (currentLessonCount + 1));
        console.log('Section ID:', sectionId);
        console.log('===========================');

        addLessonMutation.mutate(formDataToSend);
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            videoUrl: '',
            isFree: false,
            duration: '',
            order: ''
        });
        setAttachment(null);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                toast({
                    variant: 'destructive',
                    title: 'File Too Large',
                    description: 'Maximum file size is 50MB',
                });
                return;
            }
            setAttachment(file);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Lesson</DialogTitle>
                    <DialogDescription>
                        Create a new lesson with video content and optional materials.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Lesson Title */}
                        <div className="space-y-2">
                            <Label htmlFor="lesson-title">
                                Lesson Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lesson-title"
                                placeholder="e.g., Understanding React Hooks"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="lesson-description">Description</Label>
                            <Textarea
                                id="lesson-description"
                                placeholder="What will students learn in this lesson?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                            <p className="text-xs text-muted-foreground">
                                Supports Markdown formatting
                            </p>
                        </div>

                        {/* Video URL */}
                        <div className="space-y-2">
                            <Label htmlFor="video-url">
                                Video URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="video-url"
                                type="url"
                                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                YouTube, Vimeo, or direct video URL
                            </p>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="e.g., 15"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        {/* Free Preview Toggle */}
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="free-preview" className="text-base">
                                    Free Preview
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow non-enrolled students to watch this lesson
                                </p>
                            </div>
                            <Switch
                                id="free-preview"
                                checked={formData.isFree}
                                onCheckedChange={(checked: boolean) => setFormData({ ...formData, isFree: checked })}
                            />
                        </div>

                        {/* Attachment Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="attachment">Attachment (Optional)</Label>
                            {!attachment ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="attachment"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.zip,.rar"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('attachment')?.click()}
                                        className="w-full"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload File (PDF, DOC, ZIP)
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{attachment.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeAttachment}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Max file size: 50MB
                            </p>
                        </div>

                        {/* Order */}
                        <div className="space-y-2">
                            <Label htmlFor="lesson-order">Order (Optional)</Label>
                            <Input
                                id="lesson-order"
                                type="number"
                                min="1"
                                placeholder={`Leave empty for order ${currentLessonCount + 1}`}
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
                            disabled={addLessonMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addLessonMutation.isPending}>
                            {addLessonMutation.isPending ? 'Adding...' : 'Add Lesson'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
