import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Star, Play } from 'lucide-react';

// TYPES
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
        bio?: string;
    };
    sections: Array<{
        id: string;
        title: string;
        order: number;
        lessons: Array<{
            id: string;
            title: string;
            isFree: boolean;
            order: number;
        }>;
    }>;
    reviews: Array<{
        id: string;
        rating: number;
        comment: string;
        user: { name: string; avatar?: string };
        createdAt: string;
    }>;
}

const CourseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Build backend URL
    const API_BASE =
        import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

    // Fetch course
    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data.data as Course;
        }
    });

    // Fetch reviews
    const { data: reviewsData } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const res = await api.get(`/reviews/course/${id}`);
            return res.data.data;
        },
        enabled: !!id
    });

    // Enroll Mutation
    const enrollMutation = useMutation({
        mutationFn: async () => api.post('/student/enroll', { courseId: id }),
        onSuccess: () => {
            toast({ title: 'Success', description: 'Enrolled successfully!' });
            queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
            navigate(`/learning/${id}`);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to enroll'
            });
        }
    });

    // Fetch student enrollment
    const { data: enrollments } = useQuery({
        queryKey: ['student-enrollments'],
        queryFn: async () => {
            const res = await api.get('/student/enrollments');
            return res.data.data;
        },
        enabled: !!user && user.role === 'STUDENT'
    });

    const isEnrolled =
        user && course && enrollments?.some((e: any) => e.course.id === course.id);

    if (isLoading) return <div className="container mx-auto py-8">Loading...</div>;
    if (!course) return <div className="container mx-auto py-8">Course not found</div>;

    // Compute stats
    const freeLessons = course.sections.flatMap((s) => s.lessons.filter((l) => l.isFree));
    const avgRating = reviewsData?.stats?.averageRating || 0;
    const totalReviews = reviewsData?.stats?.totalReviews || 0;

    // FIXED THUMBNAIL URL HANDLER
    const thumbnail = course.thumbnail
        ? `${API_BASE}${course.thumbnail.startsWith("/") ? course.thumbnail : "/" + course.thumbnail}`
        : null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT */}
                <div className="lg:col-span-2">

                    {thumbnail && (
                        <img
                            src={thumbnail}
                            alt={course.title}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                    )}

                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

                    {/* Rating + Category */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.round(avgRating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {avgRating.toFixed(1)} ({totalReviews} reviews)
                            </span>
                        </div>

                        <Badge>{course.category}</Badge>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        {/* OVERVIEW */}
                        <TabsContent value="overview" className="mt-4">
                            <p className="text-muted-foreground whitespace-pre-line">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {course.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </TabsContent>

                        {/* CURRICULUM */}
                        <TabsContent value="curriculum" className="mt-4">
                            {course.sections.map((section) => (
                                <Card key={section.id} className="mb-4">
                                    <CardHeader>
                                        <CardTitle>{section.title}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        {section.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded"
                                            >
                                                <Play className="h-4 w-4 text-muted-foreground" />
                                                <span className="flex-1">{lesson.title}</span>
                                                {lesson.isFree && (
                                                    <Badge variant="secondary">Free</Badge>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        {/* REVIEWS */}
                        <TabsContent value="reviews" className="mt-4">
                            {reviewsData?.reviews?.length ? (
                                reviewsData.reviews.map((rv: any) => (
                                    <Card key={rv.id} className="mb-4">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                        {rv.user.name[0]}
                                                    </div>

                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {rv.user.name}
                                                        </CardTitle>

                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < rv.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(rv.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <p className="text-muted-foreground">{rv.comment}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    No reviews yet.
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* RIGHT - Enrollment */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div className="text-3xl font-bold">
                                {course.price === 0 ? "Free" : `$${course.price}`}
                            </div>

                            {/* Enroll */}
                            {user?.role === "STUDENT" && (
                                <Button
                                    className="w-full"
                                    onClick={() => enrollMutation.mutate()}
                                    disabled={isEnrolled || enrollMutation.isPending}
                                >
                                    {isEnrolled
                                        ? "Enrolled"
                                        : enrollMutation.isPending
                                        ? "Enrolling..."
                                        : "Enroll Now"}
                                </Button>
                            )}

                            {!user && (
                                <Link to="/login">
                                    <Button className="w-full">Login to Enroll</Button>
                                </Link>
                            )}

                            {/* Instructor */}
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-2">Instructor</h3>

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                        {course.instructor.name[0]}
                                    </div>

                                    <div>
                                        <div className="font-medium">
                                            {course.instructor.name}
                                        </div>
                                        {course.instructor.bio && (
                                            <p className="text-sm text-muted-foreground">
                                                {course.instructor.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Free Preview */}
                            {freeLessons.length > 0 && (
                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold mb-2">Free Preview</h3>

                                    <div className="space-y-2">
                                        {freeLessons.slice(0, 3).map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <Play className="h-4 w-4 text-muted-foreground" />
                                                <span>{lesson.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default CourseDetails;
