import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Sparkles, GraduationCap } from 'lucide-react';
import api from '@/services/api';

const Home = () => {
    // Fetch popular courses
    const { data: popularCourses } = useQuery({
        queryKey: ['courses', 'popular'],
        queryFn: async () => {
            const res = await api.get('/courses/popular');
            return res.data.data;
        },
    });

    // Fetch new courses
    const { data: newCourses } = useQuery({
        queryKey: ['courses', 'new'],
        queryFn: async () => {
            const res = await api.get('/courses/new');
            return res.data.data;
        },
    });

    const features = [
        {
            icon: BookOpen,
            title: 'Expert-Led Courses',
            description: 'Learn from industry professionals with real-world experience',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Users,
            title: 'Interactive Learning',
            description: 'Engage with assignments, projects, and peer discussions',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Award,
            title: 'Earn Certificates',
            description: 'Get recognized with professional certificates upon completion',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: TrendingUp,
            title: 'Career Growth',
            description: 'Advance your career with in-demand skills and knowledge',
            color: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="container mx-auto px-4 py-20 md:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">Welcome to Your Learning Journey</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                                Master New Skills with{' '}
                                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    Expert-Led Courses
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Unlock your potential with our comprehensive learning platform.
                                Learn from industry experts and advance your career today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/courses">
                                    <Button size="lg" className="h-14 px-8 text-lg group">
                                        Browse Courses
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                                        <GraduationCap className="mr-2 w-5 h-5" />
                                        Start Learning Free
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </section>

            {/* Popular Courses Section */}
            {popularCourses && popularCourses.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-semibold">Most Popular</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Trending Courses
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Join thousands of students learning the most in-demand skills
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularCourses.slice(0, 8).map((course: any, index: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/courses">
                                <Button size="lg" variant="outline">
                                    View All Courses
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* New Courses Section */}
            {newCourses && newCourses.length > 0 && (
                <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">Just Added</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                New Courses
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Explore our latest courses and stay ahead of the curve
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newCourses.slice(0, 4).map((course: any, index: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Everything you need to succeed in your learning journey
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="relative group"
                            >
                                <div className="p-6 rounded-2xl border-2 border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 h-full bg-white">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary to-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl mb-10 text-white/90">
                            Join thousands of students already learning on our platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
                                    Get Started Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/courses">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/10 border-white/20 text-white hover:bg-white/20">
                                    Explore Courses
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
