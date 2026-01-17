import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    category: string;
    tags: string[];
    instructor: {
        name: string;
        avatar?: string;
    };
}

const BrowseCourses = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Build proper API base from env
    const API_BASE =
        import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

    const { data, isLoading } = useQuery({
        queryKey: ['courses', search, category],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);

            const res = await api.get(`/courses?${params.toString()}`);
            return res.data.data as Course[];
        }
    });

    const categories = Array.from(new Set(data?.map((c) => c.category) || []));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search + Filter */}
            <div className="mb-8 pt-6">
                <h1 className="text-3xl font-bold mb-4">Browse Courses</h1>

                <div className="flex gap-4 flex-wrap">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <Select
                        value={category}
                        onValueChange={(val) => setCategory(val === 'all' ? '' : val)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>

                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="text-center py-12">Loading courses...</div>
            ) : data && data.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((course) => {
                        // FINAL FIX — correct universal URL builder
                        const thumbnail = course.thumbnail
                            ? `${API_BASE}${
                                  course.thumbnail.startsWith('/')
                                      ? course.thumbnail
                                      : '/' + course.thumbnail
                              }`
                            : null;

                        return (
                            <Card
                                key={course.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 bg-white"
                            >
                                {thumbnail && (
                                    <div className="w-full aspect-video overflow-hidden bg-gray-100">
                                        <img
                                            src={thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-lg font-semibold text-gray-900 mb-2">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm text-gray-600">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">
                                            {course.category}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            by {course.instructor.name}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {course.tags.slice(0, 3).map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">
                                        {course.price === 0
                                            ? 'Free'
                                            : `$${course.price}`}
                                    </span>
                                    <Link to={`/courses/${course.id}`}>
                                        <Button>View Details</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No courses found. Try adjusting your search or filters.
                </div>
            )}
        </div>
    );
};

export default BrowseCourses;
