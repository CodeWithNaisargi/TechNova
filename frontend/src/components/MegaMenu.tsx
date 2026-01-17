import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, BookOpen, Code, Palette, Smartphone, Cloud, Database, Brain, Layout, Server } from 'lucide-react';

const categoryIcons: Record<string, any> = {
    'Web Development': Code,
    'Backend Development': Server,
    'Full Stack Development': Layout,
    'Programming': Code,
    'Data Science': Brain,
    'Web Design': Palette,
    'Design': Palette,
    'Mobile Development': Smartphone,
    'Cloud Computing': Cloud,
    'Database': Database,
};

interface Category {
    name: string;
    count: number;
}

interface MegaMenuProps {
    categories: Category[];
}

const MegaMenu = ({ categories }: MegaMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Categories</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-[600px] bg-white rounded-lg shadow-2xl border-2 border-slate-100 overflow-hidden z-50"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-slate-900">Explore by Category</h3>

                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category, index) => {
                                    const Icon = categoryIcons[category.name] || BookOpen;

                                    return (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                to={`/courses?category=${encodeURIComponent(category.name)}`}
                                                className="block p-3 rounded-lg hover:bg-primary/5 hover:border-primary border-2 border-transparent transition-all duration-200 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors">
                                                            {category.name}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {category.count} {category.count === 1 ? 'course' : 'courses'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* View All Link */}
                            <div className="mt-6 pt-4 border-t">
                                <Link
                                    to="/courses"
                                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                                >
                                    View all courses
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MegaMenu;
