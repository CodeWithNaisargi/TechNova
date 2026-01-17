import { useState } from 'react';
import { useMutation, useQueryClient } from '@tantml:react-query';
import { Input } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface PriceEditorProps {
    courseId: string;
    initialPrice: number;
}

export const PriceEditor = ({ courseId, initialPrice }: PriceEditorProps) => {
    const [price, setPrice] = useState(initialPrice);
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const updateMutation = useMutation({
        mutationFn: async (newPrice: number) => {
            const res = await api.patch(`/admin/courses/${courseId}`, { price: newPrice });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
            setIsEditing(false);
            toast({
                title: 'Success',
                description: 'Price updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update price',
                variant: 'destructive',
            });
        },
    });

    const handleSave = () => {
        if (price !== initialPrice && price >= 0) {
            updateMutation.mutate(price);
        } else if (price < 0) {
            toast({
                title: 'Invalid Price',
                description: 'Price cannot be negative',
                variant: 'destructive',
            });
        } else {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setPrice(initialPrice);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-24 h-8"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        disabled={updateMutation.isPending}
                    />
                    <button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="p-1 hover:bg-green-100 rounded disabled:opacity-50"
                    >
                        {updateMutation.isPending ? (
                            <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4 text-green-600" />
                        )}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={updateMutation.isPending}
                        className="p-1 hover:bg-red-100 rounded disabled:opacity-50"
                    >
                        <X className="w-4 h-4 text-red-600" />
                    </button>
                </>
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded transition-colors font-medium"
                    title="Click to edit"
                >
                    ₹{initialPrice}
                </div>
            )}
        </div>
    );
};
