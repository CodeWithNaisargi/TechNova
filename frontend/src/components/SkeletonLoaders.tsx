import { Skeleton } from '@/components/ui/skeleton';

export const CourseCardSkeleton = () => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
};

export const AssignmentCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    );
};

export const DashboardCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-16 w-16 rounded-2xl" />
            </div>
        </div>
    );
};

export const CertificateCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    );
};

export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => {
    return (
        <tr className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    );
};
