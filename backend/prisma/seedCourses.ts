import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: {},
        create: {
            email: 'admin@lms.com',
            password: adminPassword,
            name: 'Admin User',
            role: Role.ADMIN,
            bio: 'Platform Administrator',
        },
    });

    // Create Instructor Users
    const instructorPassword = await bcrypt.hash('instructor123', 10);

    const instructor1 = await prisma.user.upsert({
        where: { email: 'john.doe@lms.com' },
        update: {},
        create: {
            email: 'john.doe@lms.com',
            password: instructorPassword,
            name: 'John Doe',
            role: Role.INSTRUCTOR,
            bio: 'Senior Full Stack Developer with 10+ years of experience in web technologies',
        },
    });

    const instructor2 = await prisma.user.upsert({
        where: { email: 'sarah.smith@lms.com' },
        update: {},
        create: {
            email: 'sarah.smith@lms.com',
            password: instructorPassword,
            name: 'Sarah Smith',
            role: Role.INSTRUCTOR,
            bio: 'Data Science Expert and Machine Learning Engineer',
        },
    });

    const instructor3 = await prisma.user.upsert({
        where: { email: 'mike.johnson@lms.com' },
        update: {},
        create: {
            email: 'mike.johnson@lms.com',
            password: instructorPassword,
            name: 'Mike Johnson',
            role: Role.INSTRUCTOR,
            bio: 'UI/UX Designer and Frontend Specialist',
        },
    });

    // Create Student Users
    const studentPassword = await bcrypt.hash('student123', 10);

    const student1 = await prisma.user.upsert({
        where: { email: 'student1@lms.com' },
        update: {},
        create: {
            email: 'student1@lms.com',
            password: studentPassword,
            name: 'Alice Johnson',
            role: Role.STUDENT,
        },
    });

    const student2 = await prisma.user.upsert({
        where: { email: 'student2@lms.com' },
        update: {},
        create: {
            email: 'student2@lms.com',
            password: studentPassword,
            name: 'Bob Williams',
            role: Role.STUDENT,
        },
    });

    console.log('✅ Users created');

    // Course Data
    const coursesData = [
        {
            title: 'Complete React Developer Course 2024',
            description: 'Master React.js from basics to advanced concepts. Build real-world projects including e-commerce sites, social media apps, and more. Learn React Hooks, Context API, Redux, and Next.js.',
            category: 'Web Development',
            tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Redux'],
            difficulty: 'INTERMEDIATE',
            duration: '12 weeks',
            price: 4999,
            thumbnail: '/uploads/seed/react-course.jpg',
            prerequisites: ['Basic JavaScript', 'HTML & CSS'],
            learningOutcomes: [
                'Build production-ready React applications',
                'Master React Hooks and Context API',
                'Implement state management with Redux',
                'Create responsive and accessible UIs',
                'Deploy React apps to production'
            ],
            instructor: instructor1,
            assignments: [
                { title: 'Setup React Development Environment', description: 'Install Node.js, npm, and create your first React app using Vite', order: 1 },
                { title: 'Build a Todo App with Hooks', description: 'Create a fully functional todo application using useState and useEffect', order: 2 },
                { title: 'Component Composition Project', description: 'Build a reusable component library with proper prop handling', order: 3 },
                { title: 'Context API Shopping Cart', description: 'Implement a shopping cart using Context API for state management', order: 4 },
                { title: 'Custom Hooks Development', description: 'Create custom hooks for form handling and API calls', order: 5 },
                { title: 'Redux Todo Manager', description: 'Rebuild the todo app using Redux for state management', order: 6 },
                { title: 'API Integration Project', description: 'Fetch and display data from a REST API with error handling', order: 7 },
                { title: 'React Router Navigation', description: 'Build a multi-page application with React Router', order: 8 },
                { title: 'Performance Optimization', description: 'Optimize React app using memo, useMemo, and useCallback', order: 9 },
                { title: 'Final Project: E-Commerce Store', description: 'Build a complete e-commerce application with all learned concepts', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Excellent course! Very comprehensive and well-structured.', user: student1 },
                { rating: 5, comment: 'Best React course I have taken. Highly recommended!', user: student2 },
                { rating: 4, comment: 'Great content, could use more advanced examples.', user: student1 },
                { rating: 5, comment: 'Perfect for intermediate developers.', user: student2 },
                { rating: 5, comment: 'Instructor explains concepts very clearly.', user: student1 }
            ]
        },
        {
            title: 'Node.js & Express - Backend Development Masterclass',
            description: 'Learn to build scalable backend applications with Node.js and Express. Cover REST APIs, authentication, database integration, and deployment strategies.',
            category: 'Backend Development',
            tags: ['Node.js', 'Express', 'Backend', 'API', 'MongoDB'],
            difficulty: 'INTERMEDIATE',
            duration: '10 weeks',
            price: 4499,
            thumbnail: '/uploads/seed/nodejs-course.jpg',
            prerequisites: ['JavaScript fundamentals', 'Basic understanding of HTTP'],
            learningOutcomes: [
                'Build RESTful APIs with Express',
                'Implement authentication and authorization',
                'Work with databases (MongoDB, PostgreSQL)',
                'Handle file uploads and validation',
                'Deploy Node.js applications'
            ],
            instructor: instructor1,
            assignments: [
                { title: 'Node.js Basics Setup', description: 'Setup Node.js environment and create your first server', order: 1 },
                { title: 'Express Server Creation', description: 'Build a basic Express server with routing', order: 2 },
                { title: 'REST API Design', description: 'Design and implement a RESTful API for a blog', order: 3 },
                { title: 'MongoDB Integration', description: 'Connect MongoDB and perform CRUD operations', order: 4 },
                { title: 'User Authentication', description: 'Implement JWT-based authentication system', order: 5 },
                { title: 'File Upload System', description: 'Create file upload functionality with Multer', order: 6 },
                { title: 'Input Validation', description: 'Implement request validation using Joi or Zod', order: 7 },
                { title: 'Error Handling Middleware', description: 'Create centralized error handling', order: 8 },
                { title: 'API Documentation', description: 'Document your API using Swagger', order: 9 },
                { title: 'Final Project: Social Media API', description: 'Build a complete social media backend API', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Fantastic backend course!', user: student1 },
                { rating: 5, comment: 'Very practical and hands-on.', user: student2 },
                { rating: 4, comment: 'Good coverage of Node.js concepts.', user: student1 },
                { rating: 5, comment: 'Learned so much about backend development.', user: student2 },
                { rating: 5, comment: 'Great instructor and content.', user: student1 }
            ]
        },
        {
            title: 'MERN Stack - Complete Full Stack Development',
            description: 'Build full-stack applications using MongoDB, Express, React, and Node.js. Learn to create production-ready web applications from scratch.',
            category: 'Full Stack Development',
            tags: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js'],
            difficulty: 'ADVANCED',
            duration: '16 weeks',
            price: 6999,
            thumbnail: '/uploads/seed/mern-course.jpg',
            prerequisites: ['React basics', 'Node.js fundamentals', 'JavaScript ES6+'],
            learningOutcomes: [
                'Build complete MERN stack applications',
                'Implement real-time features with Socket.io',
                'Deploy full-stack apps to cloud platforms',
                'Implement advanced authentication flows',
                'Create responsive and modern UIs'
            ],
            instructor: instructor1,
            assignments: [
                { title: 'MERN Project Setup', description: 'Setup full MERN stack development environment', order: 1 },
                { title: 'Database Schema Design', description: 'Design MongoDB schemas for your application', order: 2 },
                { title: 'Backend API Development', description: 'Create Express API with authentication', order: 3 },
                { title: 'React Frontend Setup', description: 'Setup React frontend with routing', order: 4 },
                { title: 'Frontend-Backend Integration', description: 'Connect React frontend to Express backend', order: 5 },
                { title: 'User Authentication Flow', description: 'Implement complete auth flow (login, register, logout)', order: 6 },
                { title: 'CRUD Operations', description: 'Implement create, read, update, delete functionality', order: 7 },
                { title: 'File Upload Feature', description: 'Add image upload functionality', order: 8 },
                { title: 'Real-time Features', description: 'Implement real-time updates with Socket.io', order: 9 },
                { title: 'Final Project: Full Stack App', description: 'Build a complete MERN application (e.g., task manager, blog)', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Best MERN course available!', user: student1 },
                { rating: 5, comment: 'Comprehensive and very detailed.', user: student2 },
                { rating: 5, comment: 'Worth every penny!', user: student1 },
                { rating: 4, comment: 'Challenging but rewarding.', user: student2 },
                { rating: 5, comment: 'Excellent project-based learning.', user: student1 }
            ]
        },
        {
            title: 'Python Programming - From Beginner to Advanced',
            description: 'Complete Python course covering basics to advanced topics. Learn data structures, OOP, file handling, and popular libraries like NumPy and Pandas.',
            category: 'Programming',
            tags: ['Python', 'Programming', 'Data Structures', 'OOP'],
            difficulty: 'BEGINNER',
            duration: '8 weeks',
            price: 3499,
            thumbnail: '/uploads/seed/python-course.jpg',
            prerequisites: [],
            learningOutcomes: [
                'Master Python syntax and fundamentals',
                'Understand object-oriented programming',
                'Work with Python libraries and modules',
                'Handle files and exceptions',
                'Build real-world Python applications'
            ],
            instructor: instructor2,
            assignments: [
                { title: 'Python Installation & Hello World', description: 'Setup Python and write your first program', order: 1 },
                { title: 'Variables and Data Types', description: 'Practice with different data types and variables', order: 2 },
                { title: 'Control Flow Exercises', description: 'Implement if-else statements and loops', order: 3 },
                { title: 'Functions and Modules', description: 'Create reusable functions and modules', order: 4 },
                { title: 'List and Dictionary Operations', description: 'Master Python collections', order: 5 },
                { title: 'Object-Oriented Programming', description: 'Create classes and objects', order: 6 },
                { title: 'File Handling Project', description: 'Read and write files in Python', order: 7 },
                { title: 'Exception Handling', description: 'Implement error handling in your code', order: 8 },
                { title: 'Working with Libraries', description: 'Use NumPy and Pandas for data manipulation', order: 9 },
                { title: 'Final Project: Python Application', description: 'Build a complete Python application', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Perfect for beginners!', user: student1 },
                { rating: 5, comment: 'Very clear explanations.', user: student2 },
                { rating: 5, comment: 'Great introduction to Python.', user: student1 },
                { rating: 4, comment: 'Good pace for learning.', user: student2 },
                { rating: 5, comment: 'Highly recommended for Python beginners.', user: student1 }
            ]
        },
        {
            title: 'Java Programming Complete Course',
            description: 'Learn Java from scratch. Cover core Java concepts, OOP principles, collections, multithreading, and build enterprise-level applications.',
            category: 'Programming',
            tags: ['Java', 'OOP', 'Programming', 'Enterprise'],
            difficulty: 'INTERMEDIATE',
            duration: '12 weeks',
            price: 4299,
            thumbnail: '/uploads/seed/java-course.jpg',
            prerequisites: ['Basic programming knowledge'],
            learningOutcomes: [
                'Master Java syntax and core concepts',
                'Implement OOP principles in Java',
                'Work with Java collections framework',
                'Understand multithreading and concurrency',
                'Build enterprise Java applications'
            ],
            instructor: instructor2,
            assignments: [
                { title: 'Java Setup and First Program', description: 'Install JDK and write Hello World', order: 1 },
                { title: 'Java Basics Practice', description: 'Practice variables, operators, and control flow', order: 2 },
                { title: 'OOP Concepts Implementation', description: 'Create classes with inheritance and polymorphism', order: 3 },
                { title: 'Interface and Abstract Classes', description: 'Implement interfaces and abstract classes', order: 4 },
                { title: 'Collections Framework', description: 'Work with List, Set, Map interfaces', order: 5 },
                { title: 'Exception Handling in Java', description: 'Implement try-catch and custom exceptions', order: 6 },
                { title: 'File I/O Operations', description: 'Read and write files in Java', order: 7 },
                { title: 'Multithreading Basics', description: 'Create and manage threads', order: 8 },
                { title: 'Java Streams API', description: 'Use Java 8 streams for data processing', order: 9 },
                { title: 'Final Project: Java Application', description: 'Build a complete Java desktop application', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Excellent Java course!', user: student1 },
                { rating: 4, comment: 'Very comprehensive coverage.', user: student2 },
                { rating: 5, comment: 'Great for learning Java.', user: student1 },
                { rating: 5, comment: 'Well-structured content.', user: student2 },
                { rating: 5, comment: 'Highly recommended!', user: student1 }
            ]
        },
        {
            title: 'Data Science & Machine Learning with Python',
            description: 'Comprehensive data science course covering statistics, data analysis, visualization, and machine learning algorithms using Python.',
            category: 'Data Science',
            tags: ['Data Science', 'Machine Learning', 'Python', 'AI'],
            difficulty: 'ADVANCED',
            duration: '14 weeks',
            price: 7999,
            thumbnail: '/uploads/seed/datascience-course.jpg',
            prerequisites: ['Python programming', 'Basic mathematics and statistics'],
            learningOutcomes: [
                'Perform data analysis with Pandas',
                'Create visualizations with Matplotlib and Seaborn',
                'Implement machine learning algorithms',
                'Build predictive models',
                'Deploy ML models to production'
            ],
            instructor: instructor2,
            assignments: [
                { title: 'Data Science Environment Setup', description: 'Setup Jupyter, Pandas, NumPy, and Scikit-learn', order: 1 },
                { title: 'Data Exploration with Pandas', description: 'Load and explore datasets', order: 2 },
                { title: 'Data Cleaning Project', description: 'Clean and preprocess real-world data', order: 3 },
                { title: 'Data Visualization', description: 'Create charts and graphs with Matplotlib', order: 4 },
                { title: 'Statistical Analysis', description: 'Perform statistical tests and analysis', order: 5 },
                { title: 'Linear Regression Model', description: 'Build and evaluate a linear regression model', order: 6 },
                { title: 'Classification Algorithms', description: 'Implement logistic regression and decision trees', order: 7 },
                { title: 'Clustering Analysis', description: 'Perform K-means clustering', order: 8 },
                { title: 'Model Evaluation', description: 'Evaluate models using various metrics', order: 9 },
                { title: 'Final Project: ML Application', description: 'Build a complete machine learning project', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Amazing data science course!', user: student1 },
                { rating: 5, comment: 'Very practical and hands-on.', user: student2 },
                { rating: 5, comment: 'Best ML course I have taken.', user: student1 },
                { rating: 4, comment: 'Challenging but worth it.', user: student2 },
                { rating: 5, comment: 'Excellent instructor!', user: student1 }
            ]
        },
        {
            title: 'Modern Web Design with HTML, CSS & JavaScript',
            description: 'Learn modern web design principles. Master HTML5, CSS3, responsive design, animations, and JavaScript for interactive websites.',
            category: 'Web Design',
            tags: ['HTML', 'CSS', 'JavaScript', 'Web Design', 'Responsive'],
            difficulty: 'BEGINNER',
            duration: '6 weeks',
            price: 2999,
            thumbnail: '/uploads/seed/webdesign-course.jpg',
            prerequisites: [],
            learningOutcomes: [
                'Build responsive websites from scratch',
                'Master CSS Grid and Flexbox',
                'Create animations and transitions',
                'Implement JavaScript interactivity',
                'Follow modern web design principles'
            ],
            instructor: instructor3,
            assignments: [
                { title: 'HTML Basics Project', description: 'Create a basic HTML webpage structure', order: 1 },
                { title: 'CSS Styling Fundamentals', description: 'Style your webpage with CSS', order: 2 },
                { title: 'Responsive Layout with Flexbox', description: 'Create a responsive layout using Flexbox', order: 3 },
                { title: 'CSS Grid Layout', description: 'Build a grid-based layout', order: 4 },
                { title: 'CSS Animations', description: 'Add animations and transitions', order: 5 },
                { title: 'JavaScript DOM Manipulation', description: 'Make your page interactive with JavaScript', order: 6 },
                { title: 'Form Validation', description: 'Implement client-side form validation', order: 7 },
                { title: 'Mobile-First Design', description: 'Create a mobile-first responsive website', order: 8 },
                { title: 'CSS Frameworks', description: 'Use Bootstrap or Tailwind CSS', order: 9 },
                { title: 'Final Project: Portfolio Website', description: 'Build your personal portfolio website', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Perfect for web design beginners!', user: student1 },
                { rating: 5, comment: 'Very well explained.', user: student2 },
                { rating: 5, comment: 'Great introduction to web design.', user: student1 },
                { rating: 4, comment: 'Good practical examples.', user: student2 },
                { rating: 5, comment: 'Highly recommended!', user: student1 }
            ]
        },
        {
            title: 'UI/UX Design Masterclass - Figma to Production',
            description: 'Complete UI/UX design course. Learn design thinking, user research, wireframing, prototyping with Figma, and handoff to developers.',
            category: 'Design',
            tags: ['UI/UX', 'Figma', 'Design', 'Prototyping'],
            difficulty: 'INTERMEDIATE',
            duration: '10 weeks',
            price: 5499,
            thumbnail: '/uploads/seed/uiux-course.jpg',
            prerequisites: ['Basic design knowledge'],
            learningOutcomes: [
                'Master UI/UX design principles',
                'Conduct user research and testing',
                'Create wireframes and prototypes',
                'Design in Figma professionally',
                'Handoff designs to developers'
            ],
            instructor: instructor3,
            assignments: [
                { title: 'Design Thinking Basics', description: 'Learn and apply design thinking process', order: 1 },
                { title: 'User Research Project', description: 'Conduct user interviews and surveys', order: 2 },
                { title: 'Wireframing Exercise', description: 'Create low-fidelity wireframes', order: 3 },
                { title: 'Figma Basics', description: 'Learn Figma interface and tools', order: 4 },
                { title: 'UI Design System', description: 'Create a design system with components', order: 5 },
                { title: 'High-Fidelity Mockups', description: 'Design polished UI screens', order: 6 },
                { title: 'Prototyping in Figma', description: 'Create interactive prototypes', order: 7 },
                { title: 'Usability Testing', description: 'Conduct usability tests with users', order: 8 },
                { title: 'Developer Handoff', description: 'Prepare designs for development', order: 9 },
                { title: 'Final Project: App Design', description: 'Design a complete mobile or web application', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Best UI/UX course!', user: student1 },
                { rating: 5, comment: 'Very practical and industry-relevant.', user: student2 },
                { rating: 5, comment: 'Learned so much about design.', user: student1 },
                { rating: 4, comment: 'Great Figma tutorials.', user: student2 },
                { rating: 5, comment: 'Highly recommended for designers.', user: student1 }
            ]
        },
        {
            title: 'Android App Development with Kotlin',
            description: 'Build native Android applications using Kotlin. Learn Android SDK, Material Design, APIs, databases, and publish apps to Play Store.',
            category: 'Mobile Development',
            tags: ['Android', 'Kotlin', 'Mobile', 'App Development'],
            difficulty: 'INTERMEDIATE',
            duration: '12 weeks',
            price: 5999,
            thumbnail: '/uploads/seed/android-course.jpg',
            prerequisites: ['Basic programming knowledge', 'Kotlin basics'],
            learningOutcomes: [
                'Build native Android apps with Kotlin',
                'Implement Material Design guidelines',
                'Work with Android SDK and APIs',
                'Integrate databases and storage',
                'Publish apps to Google Play Store'
            ],
            instructor: instructor1,
            assignments: [
                { title: 'Android Studio Setup', description: 'Setup Android development environment', order: 1 },
                { title: 'First Android App', description: 'Create Hello World Android app', order: 2 },
                { title: 'Layouts and Views', description: 'Design app layouts with XML', order: 3 },
                { title: 'Activities and Intents', description: 'Navigate between screens', order: 4 },
                { title: 'RecyclerView Implementation', description: 'Display lists with RecyclerView', order: 5 },
                { title: 'Room Database', description: 'Implement local database with Room', order: 6 },
                { title: 'API Integration', description: 'Fetch data from REST APIs', order: 7 },
                { title: 'Material Design Components', description: 'Use Material Design in your app', order: 8 },
                { title: 'App Testing', description: 'Write unit and UI tests', order: 9 },
                { title: 'Final Project: Complete Android App', description: 'Build and publish a complete app', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Excellent Android course!', user: student1 },
                { rating: 5, comment: 'Very comprehensive.', user: student2 },
                { rating: 4, comment: 'Great for learning Android.', user: student1 },
                { rating: 5, comment: 'Well-structured lessons.', user: student2 },
                { rating: 5, comment: 'Highly recommended!', user: student1 }
            ]
        },
        {
            title: 'Cloud Computing with AWS - Complete Guide',
            description: 'Master Amazon Web Services (AWS). Learn EC2, S3, Lambda, RDS, CloudFormation, and deploy scalable cloud applications.',
            category: 'Cloud Computing',
            tags: ['AWS', 'Cloud', 'DevOps', 'Infrastructure'],
            difficulty: 'ADVANCED',
            duration: '10 weeks',
            price: 6499,
            thumbnail: '/uploads/seed/aws-course.jpg',
            prerequisites: ['Basic Linux knowledge', 'Understanding of web applications'],
            learningOutcomes: [
                'Master core AWS services',
                'Deploy applications to AWS',
                'Implement cloud security best practices',
                'Automate infrastructure with CloudFormation',
                'Optimize cloud costs'
            ],
            instructor: instructor1,
            assignments: [
                { title: 'AWS Account Setup', description: 'Create and configure AWS account', order: 1 },
                { title: 'EC2 Instance Launch', description: 'Launch and configure EC2 instances', order: 2 },
                { title: 'S3 Storage Setup', description: 'Create S3 buckets and manage files', order: 3 },
                { title: 'RDS Database', description: 'Setup managed database with RDS', order: 4 },
                { title: 'Lambda Functions', description: 'Create serverless functions with Lambda', order: 5 },
                { title: 'Load Balancing', description: 'Implement load balancers', order: 6 },
                { title: 'CloudFormation Templates', description: 'Automate infrastructure deployment', order: 7 },
                { title: 'Security Groups and IAM', description: 'Configure security and access control', order: 8 },
                { title: 'Monitoring with CloudWatch', description: 'Setup monitoring and alerts', order: 9 },
                { title: 'Final Project: Deploy Full Stack App', description: 'Deploy a complete application on AWS', order: 10 }
            ],
            reviews: [
                { rating: 5, comment: 'Best AWS course available!', user: student1 },
                { rating: 5, comment: 'Very practical and hands-on.', user: student2 },
                { rating: 5, comment: 'Learned everything about AWS.', user: student1 },
                { rating: 4, comment: 'Great for cloud beginners.', user: student2 },
                { rating: 5, comment: 'Highly recommended!', user: student1 }
            ]
        }
    ];

    // Create courses with assignments and reviews
    for (const courseData of coursesData) {
        const { assignments, reviews, instructor, ...courseInfo } = courseData;

        const course = await prisma.course.create({
            data: {
                ...courseInfo,
                instructorId: instructor.id,
                isPublished: true,
            },
        });

        console.log(`✅ Created course: ${course.title}`);

        // Create assignments for this course
        for (const assignment of assignments) {
            await prisma.assignment.create({
                data: {
                    ...assignment,
                    courseId: course.id,
                },
            });
        }

        console.log(`  ✅ Created ${assignments.length} assignments`);

        // Create reviews for this course
        for (const review of reviews) {
            await prisma.review.create({
                data: {
                    rating: review.rating,
                    comment: review.comment,
                    userId: review.user.id,
                    courseId: course.id,
                },
            });
        }

        console.log(`  ✅ Created ${reviews.length} reviews`);
    }

    console.log('🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${coursesData.length} professional courses`);
    console.log(`- Created ${coursesData.length * 10} assignments`);
    console.log(`- Created ${coursesData.length * 5} reviews`);
    console.log('\n👤 Test Accounts:');
    console.log('Admin: admin@lms.com / admin123');
    console.log('Instructor: john.doe@lms.com / instructor123');
    console.log('Student: student1@lms.com / student123');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
