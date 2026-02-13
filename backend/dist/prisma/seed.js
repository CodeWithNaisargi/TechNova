"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    const adminPassword = await bcryptjs_1.default.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: {},
        create: {
            email: 'admin@lms.com',
            name: 'Admin User',
            password: adminPassword,
            role: client_1.Role.ADMIN,
            bio: 'System Administrator',
        },
    });
    console.log('Created admin:', admin.email);
    const instructor1Password = await bcryptjs_1.default.hash('Instructor@123', 10);
    const instructor1 = await prisma.user.upsert({
        where: { email: 'instructor1@lms.com' },
        update: {},
        create: {
            email: 'instructor1@lms.com',
            name: 'John Doe',
            password: instructor1Password,
            role: client_1.Role.INSTRUCTOR,
            bio: 'Senior Web Developer with 10+ years of experience in React, Node.js, and Full-Stack Development',
        },
    });
    const instructor2Password = await bcryptjs_1.default.hash('Instructor@123', 10);
    const instructor2 = await prisma.user.upsert({
        where: { email: 'instructor2@lms.com' },
        update: {},
        create: {
            email: 'instructor2@lms.com',
            name: 'Jane Smith',
            password: instructor2Password,
            role: client_1.Role.INSTRUCTOR,
            bio: 'Expert in Python, Data Science, and Machine Learning. Former Google Engineer.',
        },
    });
    console.log('Created instructors');
    const student1Password = await bcryptjs_1.default.hash('Student@123', 10);
    const student1 = await prisma.user.upsert({
        where: { email: 'student1@lms.com' },
        update: {},
        create: {
            email: 'student1@lms.com',
            name: 'Alice Johnson',
            password: student1Password,
            role: client_1.Role.STUDENT,
        },
    });
    const student2Password = await bcryptjs_1.default.hash('Student@123', 10);
    const student2 = await prisma.user.upsert({
        where: { email: 'student2@lms.com' },
        update: {},
        create: {
            email: 'student2@lms.com',
            name: 'Bob Williams',
            password: student2Password,
            role: client_1.Role.STUDENT,
        },
    });
    const student3Password = await bcryptjs_1.default.hash('Student@123', 10);
    const student3 = await prisma.user.upsert({
        where: { email: 'student3@lms.com' },
        update: {},
        create: {
            email: 'student3@lms.com',
            name: 'Charlie Brown',
            password: student3Password,
            role: client_1.Role.STUDENT,
        },
    });
    console.log('Created students');
    const course1 = await prisma.course.create({
        data: {
            title: 'Complete React Development Bootcamp',
            description: 'Master React from fundamentals to advanced patterns. Build real-world applications with hooks, context, and modern React architecture.',
            price: 49.99,
            category: 'Web Development',
            tags: ['react', 'javascript', 'frontend', 'hooks', 'typescript'],
            instructorId: instructor1.id,
            isPublished: true,
            thumbnail: '/uploads/thumbnails/react-course.jpg',
            sections: {
                create: [
                    {
                        title: 'Getting Started with React',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Introduction to React',
                                    description: 'Learn what React is and why it\'s popular',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: true,
                                },
                                {
                                    title: 'Setting Up Your Development Environment',
                                    description: 'Install Node.js, VS Code, and create your first React app',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: true,
                                },
                                {
                                    title: 'Understanding JSX',
                                    description: 'Learn the syntax that makes React powerful',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 3,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Components and Props',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Creating Your First Component',
                                    description: 'Build reusable components',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: false,
                                },
                                {
                                    title: 'Props and Data Flow',
                                    description: 'Pass data between components',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'State and Hooks',
                        order: 3,
                        lessons: {
                            create: [
                                {
                                    title: 'useState Hook',
                                    description: 'Manage component state',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: false,
                                },
                                {
                                    title: 'useEffect Hook',
                                    description: 'Handle side effects and lifecycle',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    const course2 = await prisma.course.create({
        data: {
            title: 'Advanced Node.js and Express',
            description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Learn RESTful APIs, authentication, and deployment.',
            price: 59.99,
            category: 'Backend Development',
            tags: ['nodejs', 'express', 'backend', 'api', 'mongodb'],
            instructorId: instructor1.id,
            isPublished: true,
            thumbnail: '/uploads/thumbnails/nodejs-course.jpg',
            sections: {
                create: [
                    {
                        title: 'Node.js Fundamentals',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Introduction to Node.js',
                                    description: 'Understanding the Node.js runtime',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: true,
                                },
                                {
                                    title: 'Modules and NPM',
                                    description: 'Working with Node.js modules',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Building REST APIs',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Express.js Setup',
                                    description: 'Setting up Express server',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: false,
                                },
                                {
                                    title: 'Creating API Endpoints',
                                    description: 'Build CRUD operations',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    const course3 = await prisma.course.create({
        data: {
            title: 'Python for Data Science',
            description: 'Learn Python programming for data analysis, visualization, and machine learning. Master pandas, numpy, and matplotlib.',
            price: 39.99,
            category: 'Data Science',
            tags: ['python', 'data-science', 'pandas', 'numpy', 'machine-learning'],
            instructorId: instructor2.id,
            isPublished: true,
            thumbnail: '/uploads/thumbnails/python-course.jpg',
            sections: {
                create: [
                    {
                        title: 'Python Basics',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'Python Fundamentals',
                                    description: 'Variables, data types, and basic operations',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: true,
                                },
                                {
                                    title: 'Data Structures',
                                    description: 'Lists, dictionaries, and sets',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                    {
                        title: 'Data Analysis with Pandas',
                        order: 2,
                        lessons: {
                            create: [
                                {
                                    title: 'Introduction to Pandas',
                                    description: 'Working with DataFrames',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: false,
                                },
                                {
                                    title: 'Data Manipulation',
                                    description: 'Filtering, grouping, and transforming data',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    const course4 = await prisma.course.create({
        data: {
            title: 'Full-Stack TypeScript Development',
            description: 'Build type-safe full-stack applications with TypeScript, React, and Node.js. Learn best practices and advanced patterns.',
            price: 69.99,
            category: 'Web Development',
            tags: ['typescript', 'react', 'nodejs', 'fullstack', 'types'],
            instructorId: instructor1.id,
            isPublished: true,
            thumbnail: '/uploads/thumbnails/typescript-course.jpg',
            sections: {
                create: [
                    {
                        title: 'TypeScript Fundamentals',
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: 'TypeScript Basics',
                                    description: 'Types, interfaces, and type inference',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 1,
                                    isFree: true,
                                },
                                {
                                    title: 'Advanced Types',
                                    description: 'Generics, utility types, and conditional types',
                                    videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                                    order: 2,
                                    isFree: false,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log('Created courses');
    const enrollment1 = await prisma.enrollment.create({
        data: {
            userId: student1.id,
            courseId: course1.id,
        },
    });
    const enrollment2 = await prisma.enrollment.create({
        data: {
            userId: student1.id,
            courseId: course3.id,
        },
    });
    const enrollment3 = await prisma.enrollment.create({
        data: {
            userId: student2.id,
            courseId: course1.id,
        },
    });
    const enrollment4 = await prisma.enrollment.create({
        data: {
            userId: student2.id,
            courseId: course2.id,
        },
    });
    const enrollment5 = await prisma.enrollment.create({
        data: {
            userId: student3.id,
            courseId: course1.id,
        },
    });
    console.log('Created enrollments');
    const course1Lessons = await prisma.lesson.findMany({
        where: {
            section: {
                courseId: course1.id,
            },
        },
        take: 2,
    });
    if (course1Lessons.length >= 2) {
        await prisma.progress.create({
            data: {
                userId: student1.id,
                lessonId: course1Lessons[0].id,
                isCompleted: true,
            },
        });
        await prisma.progress.create({
            data: {
                userId: student1.id,
                lessonId: course1Lessons[1].id,
                isCompleted: true,
            },
        });
        await prisma.progress.create({
            data: {
                userId: student2.id,
                lessonId: course1Lessons[0].id,
                isCompleted: true,
            },
        });
    }
    console.log('Created progress records');
    await prisma.review.create({
        data: {
            userId: student1.id,
            courseId: course1.id,
            rating: 5,
            comment: 'Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.',
        },
    });
    await prisma.review.create({
        data: {
            userId: student2.id,
            courseId: course1.id,
            rating: 4,
            comment: 'Great content, but could use more practical examples. Overall very helpful!',
        },
    });
    await prisma.review.create({
        data: {
            userId: student1.id,
            courseId: course3.id,
            rating: 5,
            comment: 'Perfect for beginners! The Python basics section is fantastic.',
        },
    });
    console.log('Created reviews');
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
