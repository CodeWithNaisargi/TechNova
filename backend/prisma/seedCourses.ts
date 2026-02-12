import { PrismaClient, Role, EducationLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// PRODUCTION-GRADE SEED DATA
// Domains: Agriculture Technology, Healthcare Technology, Urban Technology
// Education Levels: SECONDARY, HIGHER_SECONDARY, DIPLOMA, UNDERGRADUATE, POSTGRADUATE
// ============================================================================

async function main() {
    console.log('🌱 Starting production seed...');
    console.log('📊 Domains: Agriculture, Healthcare, Urban Technology');
    console.log('🎓 Education Levels: Secondary → Postgraduate');

    // ========================================================================
    // CLEANUP - Delete existing data to prevent duplicates
    // ========================================================================
    console.log('\n🗑️  Cleaning up existing data...');
    await prisma.submission.deleteMany({});
    await prisma.assignmentProgress.deleteMany({});
    await prisma.assignment.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.section.deleteMany({});
    await prisma.course.deleteMany({});
    console.log('   ✅ Cleanup complete');

    // ========================================================================
    // PASSWORDS (Hashed with bcrypt)
    // ========================================================================
    const adminPassword = await bcrypt.hash('admin123', 10);
    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // ========================================================================
    // ADMIN USER
    // ========================================================================
    console.log('\n👤 Creating Admin...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'admin@lms.com',
            password: adminPassword,
            name: 'Platform Administrator',
            role: Role.ADMIN,
            bio: 'System Administrator for SkillOrbit LMS Platform',
            isEmailVerified: true,
        },
    });
    console.log(`   ✅ Admin: ${admin.email}`);

    // ========================================================================
    // DOMAIN INSTRUCTORS (3 per domain = 9 total)
    // ========================================================================
    console.log('\n👨‍🏫 Creating Domain Instructors...');

    // --- AGRICULTURE TECHNOLOGY INSTRUCTORS ---
    const agriInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.priya.sharma@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.priya.sharma@lms.com',
            password: instructorPassword,
            name: 'Dr. Priya Sharma',
            role: Role.INSTRUCTOR,
            bio: 'PhD in Agricultural Engineering from IIT Kharagpur. 15+ years experience in precision agriculture and smart farming systems.',
            isEmailVerified: true,
        },
    });

    const agriInstructor2 = await prisma.user.upsert({
        where: { email: 'rajesh.kumar@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'rajesh.kumar@lms.com',
            password: instructorPassword,
            name: 'Rajesh Kumar',
            role: Role.INSTRUCTOR,
            bio: 'Agricultural Technology Specialist with expertise in drone-based farming and GIS applications.',
            isEmailVerified: true,
        },
    });

    const agriInstructor3 = await prisma.user.upsert({
        where: { email: 'dr.anita.desai@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.anita.desai@lms.com',
            password: instructorPassword,
            name: 'Dr. Anita Desai',
            role: Role.INSTRUCTOR,
            bio: 'Former Director of Agricultural Extension Services. Expert in soil health and organic farming.',
            isEmailVerified: true,
        },
    });

    // --- HEALTHCARE TECHNOLOGY INSTRUCTORS ---
    const healthInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.vikram.mehta@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.vikram.mehta@lms.com',
            password: instructorPassword,
            name: 'Dr. Vikram Mehta',
            role: Role.INSTRUCTOR,
            bio: 'MD, MPH from AIIMS Delhi. Health Informatics specialist with 12+ years in hospital information systems.',
            isEmailVerified: true,
        },
    });

    const healthInstructor2 = await prisma.user.upsert({
        where: { email: 'dr.sneha.patil@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.sneha.patil@lms.com',
            password: instructorPassword,
            name: 'Dr. Sneha Patil',
            role: Role.INSTRUCTOR,
            bio: 'Biomedical Engineer and Medical Device Expert. Specialist in wearable health monitoring.',
            isEmailVerified: true,
        },
    });

    const healthInstructor3 = await prisma.user.upsert({
        where: { email: 'arun.nair@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'arun.nair@lms.com',
            password: instructorPassword,
            name: 'Arun Nair',
            role: Role.INSTRUCTOR,
            bio: 'Healthcare Data Scientist with expertise in clinical analytics and AI diagnostics.',
            isEmailVerified: true,
        },
    });

    // --- URBAN TECHNOLOGY INSTRUCTORS ---
    const urbanInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.meera.iyer@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.meera.iyer@lms.com',
            password: instructorPassword,
            name: 'Dr. Meera Iyer',
            role: Role.INSTRUCTOR,
            bio: 'Urban Planning PhD from IIT Bombay. Smart City consultant for 15+ cities.',
            isEmailVerified: true,
        },
    });

    const urbanInstructor2 = await prisma.user.upsert({
        where: { email: 'sanjay.verma@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'sanjay.verma@lms.com',
            password: instructorPassword,
            name: 'Sanjay Verma',
            role: Role.INSTRUCTOR,
            bio: 'IoT and Smart Infrastructure Architect. Built traffic management systems for major cities.',
            isEmailVerified: true,
        },
    });

    const urbanInstructor3 = await prisma.user.upsert({
        where: { email: 'dr.kavita.singh@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.kavita.singh@lms.com',
            password: instructorPassword,
            name: 'Dr. Kavita Singh',
            role: Role.INSTRUCTOR,
            bio: 'Environmental Engineer specializing in urban waste management and water treatment.',
            isEmailVerified: true,
        },
    });

    console.log('   ✅ 9 Domain Instructors created');

    // ========================================================================
    // STUDENT USERS
    // ========================================================================
    console.log('\n👨‍🎓 Creating Students...');

    const student1 = await prisma.user.upsert({
        where: { email: 'student1@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'student1@lms.com',
            password: studentPassword,
            name: 'Amit Patel',
            role: Role.STUDENT,
            bio: 'B.Tech student interested in AgriTech and sustainable farming',
            isEmailVerified: true,
            educationLevel: EducationLevel.UNDERGRADUATE,
        },
    });

    const student2 = await prisma.user.upsert({
        where: { email: 'student2@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'student2@lms.com',
            password: studentPassword,
            name: 'Priya Menon',
            role: Role.STUDENT,
            bio: 'Healthcare management professional pursuing digital health certifications',
            isEmailVerified: true,
            educationLevel: EducationLevel.POSTGRADUATE,
        },
    });

    const student3 = await prisma.user.upsert({
        where: { email: 'student3@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'student3@lms.com',
            password: studentPassword,
            name: 'Rahul Sharma',
            role: Role.STUDENT,
            bio: 'Urban planning intern exploring smart city technologies',
            isEmailVerified: true,
            educationLevel: EducationLevel.UNDERGRADUATE,
        },
    });

    console.log('   ✅ 3 Students created');

    // ========================================================================
    // COURSES BY EDUCATION LEVEL (25 total = 5 per level)
    // Each level has at least 1 course from each domain (Agriculture, Healthcare, Urban)
    // ========================================================================

    // --- SECONDARY (10th grade) - Intro Awareness Courses ---
    const secondaryCourses = [
        {
            title: 'Introduction to Smart Farming',
            description: 'Discover how technology is transforming agriculture! Learn about sensors, drones, and mobile apps that help farmers grow more food with less resources. Perfect for students curious about the future of farming.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Beginner',
            duration: '4 weeks',
            price: 999,
            prerequisites: ['Basic science knowledge'],
            learningOutcomes: ['Understand smart farming concepts', 'Identify agricultural technologies', 'Explain benefits of precision agriculture', 'Describe IoT in farming'],
            instructorId: agriInstructor3.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/agri_intro_smart_farming.jpg',
        },
        {
            title: 'Digital Health Basics',
            description: 'Explore how smartphones and wearables are changing healthcare! From fitness trackers to telemedicine apps, learn how digital tools help people stay healthy and connected to doctors.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Beginner',
            duration: '3 weeks',
            price: 799,
            prerequisites: ['Basic biology understanding'],
            learningOutcomes: ['Identify digital health tools', 'Understand telemedicine basics', 'Explain wearable health devices', 'Describe health apps usage'],
            instructorId: healthInstructor2.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/health_digital_basics.jpg',
        },
        {
            title: 'Smart Cities 101',
            description: 'What makes a city smart? Explore traffic sensors, smart lighting, and digital services that are making cities safer, cleaner, and more efficient. A fun introduction for future urban planners!',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Beginner',
            duration: '3 weeks',
            price: 799,
            prerequisites: ['General awareness'],
            learningOutcomes: ['Define smart city concepts', 'Identify urban technologies', 'Explain smart infrastructure benefits', 'Describe citizen digital services'],
            instructorId: urbanInstructor1.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/urban_smart_cities_101.jpg',
        },
        {
            title: 'Organic Farming Awareness',
            description: 'Learn the basics of chemical-free farming and why organic produce matters. Understand certification processes and how technology helps verify organic standards.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Beginner',
            duration: '3 weeks',
            price: 699,
            prerequisites: ['Interest in environment'],
            learningOutcomes: ['Understand organic farming principles', 'Identify organic certification', 'Explain digital record keeping', 'Describe sustainable practices'],
            instructorId: agriInstructor3.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/agri_organic_awareness.jpg',
        },
        {
            title: 'First Aid & Emergency Apps',
            description: 'Learn essential first aid skills and discover mobile apps that can save lives in emergencies. From CPR basics to emergency calling features, be prepared to help!',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Beginner',
            duration: '2 weeks',
            price: 599,
            prerequisites: ['None'],
            learningOutcomes: ['Perform basic first aid', 'Use emergency health apps', 'Understand emergency protocols', 'Identify when to seek help'],
            instructorId: healthInstructor1.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/health_first_aid_apps.jpg',
        },
    ];

    // --- HIGHER SECONDARY (12th grade) - Foundation Technical Courses ---
    const higherSecondaryCourses = [
        {
            title: 'Agricultural Drones: Mapping & Crop Analysis',
            description: 'Learn drone technology for agricultural applications including field mapping, crop health assessment using NDVI imaging, and precision spraying techniques. Hands-on with drone simulation software.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 2999,
            prerequisites: ['Basic computer skills', 'Physics fundamentals'],
            learningOutcomes: ['Understand drone components', 'Create field maps using imagery', 'Analyze crop health from aerial data', 'Plan agricultural drone missions'],
            instructorId: agriInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
            thumbnail: '/course-images/agri_drones_mapping.jpg',
        },
        {
            title: 'Pharmacy Management Fundamentals',
            description: 'Master the basics of digital pharmacy operations including inventory tracking, prescription processing, and drug interaction databases. Essential for aspiring pharmacists.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Beginner',
            duration: '5 weeks',
            price: 2499,
            prerequisites: ['Chemistry basics', 'Computer literacy'],
            learningOutcomes: ['Manage pharmacy inventory digitally', 'Process electronic prescriptions', 'Check drug interactions using software', 'Maintain compliance records'],
            instructorId: healthInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
            thumbnail: '/course-images/health_pharmacy_mgmt.jpg',
        },
        {
            title: 'Smart Waste Management & Recycling',
            description: 'Explore intelligent waste collection systems, sensor-based bin monitoring, and recycling tracking platforms. Learn how cities are using technology to reduce landfill waste.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Beginner',
            duration: '4 weeks',
            price: 1999,
            prerequisites: ['Environmental awareness', 'Basic math'],
            learningOutcomes: ['Understand smart bin technology', 'Analyze waste collection data', 'Track recycling metrics', 'Propose waste reduction strategies'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
            thumbnail: '/course-images/urban_waste_mgmt.jpg',
        },
        {
            title: 'Soil Health & Digital Testing',
            description: 'Learn modern soil testing techniques and digital tools for analyzing soil composition. Understand how data-driven insights help farmers choose the right fertilizers.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Beginner',
            duration: '5 weeks',
            price: 2299,
            prerequisites: ['Chemistry basics', 'Biology fundamentals'],
            learningOutcomes: ['Conduct digital soil tests', 'Interpret soil analysis reports', 'Create soil health maps', 'Recommend fertilizer applications'],
            instructorId: agriInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
            thumbnail: '/course-images/agri_soil_digital.jpg',
        },
        {
            title: 'Smart Parking Systems',
            description: 'Discover how sensors and mobile apps are solving urban parking challenges. Learn about real-time availability tracking, dynamic pricing, and space optimization analytics.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Beginner',
            duration: '4 weeks',
            price: 1799,
            prerequisites: ['Basic math', 'Mobile app familiarity'],
            learningOutcomes: ['Understand parking sensor technology', 'Analyze parking occupancy data', 'Design parking finder interfaces', 'Calculate dynamic pricing models'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
            thumbnail: '/course-images/urban_smart_parking.jpg',
        },
    ];

    // --- DIPLOMA - Technician/Applied Courses ---
    const diplomaCourses = [
        {
            title: 'Livestock Monitoring & Smart Dairy Technology',
            description: 'Implement IoT solutions for livestock health monitoring, automated feeding systems, and dairy farm digitization. Practical training on sensor installation and data interpretation.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 4999,
            prerequisites: ['Animal husbandry basics', 'Electronics fundamentals'],
            learningOutcomes: ['Deploy livestock tracking systems', 'Configure automated feeding', 'Monitor animal health remotely', 'Manage dairy operations digitally'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
            thumbnail: '/course-images/agri_livestock_iot.jpg',
        },
        {
            title: 'Medical Equipment Maintenance',
            description: 'Learn to maintain and troubleshoot common medical devices including patient monitors, ECG machines, and diagnostic equipment. Essential for hospital technicians.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 5999,
            prerequisites: ['Electronics basics', 'Basic medical device knowledge'],
            learningOutcomes: ['Perform preventive maintenance', 'Troubleshoot common device issues', 'Calibrate diagnostic equipment', 'Document maintenance procedures'],
            instructorId: healthInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
            thumbnail: '/course-images/health_equipment_maint.jpg',
        },
        {
            title: 'Traffic Sensor Installation & Maintenance',
            description: 'Hands-on training for installing, calibrating, and maintaining traffic monitoring sensors and cameras. Learn field deployment techniques and troubleshooting methods.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 4499,
            prerequisites: ['Electronics basics', 'Field work capability'],
            learningOutcomes: ['Install traffic sensors correctly', 'Calibrate detection systems', 'Troubleshoot connectivity issues', 'Perform routine maintenance'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
            thumbnail: '/course-images/urban_traffic_sensors.jpg',
        },
        {
            title: 'Greenhouse Climate Control Systems',
            description: 'Learn to install and operate automated greenhouse climate systems including temperature, humidity, and light controllers. Practical skills for protected cultivation.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 4299,
            prerequisites: ['Plant biology basics', 'Basic electrical knowledge'],
            learningOutcomes: ['Install climate control sensors', 'Configure automation systems', 'Optimize growing conditions', 'Troubleshoot climate equipment'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
            thumbnail: '/course-images/agri_greenhouse_climate.jpg',
        },
        {
            title: 'Water Quality Monitoring Technician',
            description: 'Master the installation and operation of water quality sensors for urban distribution networks. Learn to monitor parameters like pH, turbidity, and chlorine levels.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '5 weeks',
            price: 3999,
            prerequisites: ['Chemistry basics', 'Technical aptitude'],
            learningOutcomes: ['Install water quality sensors', 'Calibrate monitoring equipment', 'Interpret water quality data', 'Respond to quality alerts'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
            thumbnail: '/course-images/urban_water_quality.jpg',
        },
    ];

    // --- UNDERGRADUATE - Professional Implementation Courses ---
    const undergraduateCourses = [
        {
            title: 'Precision Agriculture with IoT Sensors',
            description: 'Design and deploy comprehensive IoT sensor networks for real-time soil moisture, temperature, and nutrient monitoring. Learn data integration with automated irrigation systems for water conservation.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 6999,
            prerequisites: ['Programming basics', 'Understanding of farming practices'],
            learningOutcomes: ['Design IoT sensor networks', 'Integrate data with irrigation systems', 'Build agricultural dashboards', 'Optimize water usage by 30-40%'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
            thumbnail: '/course-images/agri_precision_iot.jpg',
        },
        {
            title: 'Electronic Health Records (EHR) Management',
            description: 'Master EHR system administration including data migration, HL7/FHIR interoperability standards, and clinical documentation workflows. Prepare for healthcare IT certification.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 7499,
            prerequisites: ['Healthcare workflow understanding', 'Database basics'],
            learningOutcomes: ['Administer EHR systems', 'Implement data migration safely', 'Configure HL7/FHIR interfaces', 'Train clinical users effectively'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
            thumbnail: '/course-images/health_ehr_mgmt.jpg',
        },
        {
            title: 'Smart Traffic Management Systems',
            description: 'Design intelligent traffic monitoring and control systems using sensors, cameras, and AI-based signal optimization algorithms. Real-world case studies from Indian metro cities.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 6999,
            prerequisites: ['Programming knowledge', 'Basic data analytics'],
            learningOutcomes: ['Design traffic sensor networks', 'Implement signal optimization', 'Analyze traffic flow patterns', 'Reduce congestion measurably'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
            thumbnail: '/course-images/urban_traffic_mgmt.jpg',
        },
        {
            title: 'Healthcare Data Analytics & Visualization',
            description: 'Analyze clinical datasets to improve patient outcomes and operational efficiency. Master healthcare dashboards using modern visualization tools and statistical methods.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 6499,
            prerequisites: ['Statistics fundamentals', 'Excel proficiency'],
            learningOutcomes: ['Analyze clinical datasets', 'Create healthcare dashboards', 'Identify outcome patterns', 'Support evidence-based decisions'],
            instructorId: healthInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
            thumbnail: '/course-images/health_data_analytics.jpg',
        },
        {
            title: 'Urban Air Quality Monitoring',
            description: 'Deploy air quality monitoring networks and build analytics systems for pollution tracking, source identification, and public health advisories. IoT meets environmental science.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 5499,
            prerequisites: ['Environmental science basics', 'Data analysis skills'],
            learningOutcomes: ['Deploy AQI monitoring stations', 'Analyze pollution trends', 'Identify pollution sources', 'Generate health advisories'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
            thumbnail: '/course-images/urban_air_quality.jpg',
        },
    ];

    // --- POSTGRADUATE - Advanced Specialization Courses ---
    const postgraduateCourses = [
        {
            title: 'Agricultural Supply Chain & Blockchain Traceability',
            description: 'Architect blockchain-based farm-to-fork traceability systems for quality certification and direct market linkage. Advanced course for AgriTech entrepreneurs and policy makers.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Advanced',
            duration: '10 weeks',
            price: 12999,
            prerequisites: ['Supply chain knowledge', 'Programming experience'],
            learningOutcomes: ['Design traceability architectures', 'Implement blockchain certification', 'Build farmer market platforms', 'Ensure regulatory compliance'],
            instructorId: agriInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
            thumbnail: '/course-images/agri_blockchain_supply.jpg',
        },
        {
            title: 'AI-Powered Medical Image Analysis',
            description: 'Apply deep learning for medical image diagnostics including X-ray interpretation, CT scan analysis, and pathology screening. Research-oriented with publication potential.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '12 weeks',
            price: 14999,
            prerequisites: ['Python programming', 'Machine learning expertise'],
            learningOutcomes: ['Preprocess medical imaging data', 'Train diagnostic AI models', 'Validate clinical accuracy', 'Deploy AI in clinical workflows'],
            instructorId: healthInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
            thumbnail: '/course-images/health_ai_imaging.jpg',
        },
        {
            title: 'Smart City Platform Architecture',
            description: 'Design enterprise-grade integrated smart city platforms unifying mobility, utilities, safety, and citizen engagement. For architects leading digital transformation initiatives.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Advanced',
            duration: '12 weeks',
            price: 14999,
            prerequisites: ['System architecture experience', 'Project management skills'],
            learningOutcomes: ['Design integrated city platforms', 'Architect scalable data systems', 'Build citizen engagement portals', 'Manage large-scale deployments'],
            instructorId: urbanInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
            thumbnail: '/course-images/urban_smart_platform.jpg',
        },
        {
            title: 'Remote Sensing for Agricultural Policy',
            description: 'Utilize satellite imagery for large-scale crop monitoring, drought assessment, and agricultural policy planning. For researchers and government agricultural officers.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Advanced',
            duration: '10 weeks',
            price: 11999,
            prerequisites: ['GIS proficiency', 'Image processing knowledge'],
            learningOutcomes: ['Process satellite agricultural data', 'Assess crop health at scale', 'Predict yields regionally', 'Inform policy with data'],
            instructorId: agriInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
            thumbnail: '/course-images/agri_remote_sensing.jpg',
        },
        {
            title: 'Hospital Information Systems Architecture',
            description: 'Design and implement enterprise hospital information systems including EMR, billing, laboratory, and radiology integrations. For healthcare IT architects.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '12 weeks',
            price: 13999,
            prerequisites: ['Healthcare domain expertise', 'Enterprise IT experience'],
            learningOutcomes: ['Architect HIS solutions', 'Integrate clinical systems', 'Ensure data security compliance', 'Lead digital transformation'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
            thumbnail: '/course-images/health_his_architecture.jpg',
        },
    ];

    // ========================================================================
    // EXPLORATION COURSES (SECONDARY / 10th Grade)
    // Focus: Career awareness, stream selection, aptitude discovery
    // NO domains, NO job titles, NO technical tools
    // ========================================================================
    console.log('\n🔍 Creating Exploration Courses (10th Grade)...');

    const explorationCourses = [
        {
            title: 'Discover Your Career Path: A Student\'s Guide',
            description: 'An interactive exploration of different career fields to help you understand what options await after 10th grade. Discover your interests through fun activities and self-assessment.',
            category: 'Career Exploration',
            domain: null, // NO DOMAIN for 10th
            difficulty: 'Beginner',
            duration: '3 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Identify your natural interests and strengths', 'Understand different career streams', 'Make informed decisions about 11th grade stream', 'Explore modern career options'],
            instructorId: agriInstructor1.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_discover_path.jpg',
        },
        {
            title: 'Science vs Commerce vs Arts: Which Stream Fits You?',
            description: 'A comprehensive guide to understanding the three major streams after 10th. Learn what each stream offers, career prospects, and how to choose based on your personality and goals.',
            category: 'Career Exploration',
            domain: null,
            difficulty: 'Beginner',
            duration: '2 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Compare Science, Commerce, and Arts streams', 'Identify subjects in each stream', 'Understand future opportunities in each path', 'Match your interests to the right stream'],
            instructorId: healthInstructor1.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_streams.jpg',
        },
        {
            title: 'Diploma or Degree? Understanding Your Options',
            description: 'Should you pursue a diploma after 10th or continue traditional education? Learn about polytechnic diplomas, ITIs, and how they compare to the degree path.',
            category: 'Career Exploration',
            domain: null,
            difficulty: 'Beginner',
            duration: '2 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Understand diploma vs degree pathways', 'Learn about ITI and polytechnic options', 'Explore vocational training benefits', 'Make informed education decisions'],
            instructorId: urbanInstructor1.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_degree_diploma.jpg',
        },
        {
            title: 'Aptitude Discovery: Find Your Hidden Talents',
            description: 'Through interactive quizzes and exercises, discover your natural aptitudes - logical, verbal, spatial, creative. Understanding yourself is the first step to choosing the right career.',
            category: 'Career Exploration',
            domain: null,
            difficulty: 'Beginner',
            duration: '2 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Discover your aptitude strengths', 'Understand different types of intelligence', 'Match aptitudes to career fields', 'Build self-awareness for future decisions'],
            instructorId: agriInstructor2.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_aptitude.jpg',
        },
        {
            title: 'Emerging Fields: Careers of Tomorrow',
            description: 'The world of work is changing fast. Learn about new and exciting fields that didn\'t exist 10 years ago - from app development to drone operations to sustainable farming.',
            category: 'Career Exploration',
            domain: null,
            difficulty: 'Beginner',
            duration: '3 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Explore emerging career fields', 'Understand how technology creates new jobs', 'Learn about future-ready skills', 'Get inspired by innovation stories'],
            instructorId: healthInstructor2.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_emerging.jpg',
        },
        {
            title: 'Study Skills for Success: Learn How to Learn',
            description: 'Master the art of effective studying. Learn memory techniques, time management, note-taking strategies, and exam preparation skills that will help you throughout your education.',
            category: 'Foundation Skills',
            domain: null,
            difficulty: 'Beginner',
            duration: '2 weeks',
            price: 0,
            prerequisites: [],
            learningOutcomes: ['Develop effective study habits', 'Master time management', 'Learn memory enhancement techniques', 'Prepare confidently for exams'],
            instructorId: urbanInstructor2.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
            thumbnail: '/course-images/career_study_skills.jpg',
        },
    ];

    // ========================================================================
    // CREATE COURSES WITH ASSIGNMENTS
    // ========================================================================
    console.log('\n📚 Creating Courses by Education Level...');

    const allCourseData = [
        ...secondaryCourses,
        ...higherSecondaryCourses,
        ...diplomaCourses,
        ...undergraduateCourses,
        ...postgraduateCourses,
    ];
    const createdCourses: any[] = [];

    for (const courseData of allCourseData) {
        const course = await prisma.course.create({
            data: {
                title: courseData.title,
                description: courseData.description,
                category: courseData.category,
                domain: courseData.domain,
                difficulty: courseData.difficulty,
                duration: courseData.duration,
                price: courseData.price,
                prerequisites: courseData.prerequisites,
                learningOutcomes: courseData.learningOutcomes,
                instructorId: courseData.instructorId,
                isPublished: true,
                hasProject: courseData.hasProject,
                targetEducationLevel: courseData.targetEducationLevel,
                thumbnail: courseData.thumbnail,
                tags: courseData.domain
                    ? [courseData.domain.toLowerCase(), courseData.category.toLowerCase()]
                    : [courseData.category.toLowerCase()],
            },
        });
        createdCourses.push(course);

        // Create 8-10 assignments per course
        const assignmentCount = Math.floor(Math.random() * 3) + 8;
        const assignmentTypes = ['Quiz', 'Assignment', 'Project', 'Case Study', 'Lab Exercise'];

        for (let i = 1; i <= assignmentCount; i++) {
            const assignmentType = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
            await prisma.assignment.create({
                data: {
                    title: `${assignmentType} ${i}: ${courseData.title.split(':')[0]} - Week ${Math.ceil(i / 2)}`,
                    description: `Complete this ${assignmentType.toLowerCase()} to demonstrate your understanding of the concepts covered.`,
                    dueDate: new Date(Date.now() + (7 * i * 24 * 60 * 60 * 1000)),
                    maxScore: assignmentType === 'Project' ? 100 : assignmentType === 'Quiz' ? 25 : 50,
                    courseId: course.id,
                    order: i,
                },
            });
        }
    }

    console.log(`   ✅ ${createdCourses.length} Courses created with assignments`);

    // ========================================================================
    // CREATE REVIEWS
    // ========================================================================
    console.log('\n⭐ Creating Reviews...');

    const reviewTexts = [
        { rating: 5, comment: 'Excellent course! The practical exercises were very helpful for real-world application.' },
        { rating: 5, comment: 'The instructor explains complex concepts clearly. Highly recommended!' },
        { rating: 4, comment: 'Great content and well-structured. Would love more advanced topics.' },
        { rating: 4, comment: 'Very practical approach. The case studies were particularly valuable.' },
        { rating: 5, comment: 'This course transformed my understanding of the subject. Worth it!' },
    ];

    const students = [student1, student2, student3];
    let reviewCount = 0;

    for (let i = 0; i < Math.min(15, createdCourses.length); i++) {
        const course = createdCourses[i];
        const student = students[i % students.length];
        const review = reviewTexts[i % reviewTexts.length];

        try {
            await prisma.review.create({
                data: {
                    rating: review.rating,
                    comment: review.comment,
                    courseId: course.id,
                    userId: student.id,
                },
            });
            reviewCount++;
        } catch (e) {
            // Skip if review already exists
        }
    }

    console.log(`   ✅ ${reviewCount} Reviews created`);

    // ========================================================================
    // CREATE SKILLS FOR RECOMMENDATIONS
    // ========================================================================
    console.log('\n🧠 Creating Skills for Recommendation Engine...');

    // Agriculture Skills
    const skillIoT = await prisma.skill.upsert({
        where: { name: 'IoT' },
        update: {},
        create: { name: 'IoT', description: 'Internet of Things for agriculture and urban systems' }
    });
    const skillDrones = await prisma.skill.upsert({
        where: { name: 'Drone Technology' },
        update: {},
        create: { name: 'Drone Technology', description: 'Aerial mapping and precision spraying' }
    });
    const skillGIS = await prisma.skill.upsert({
        where: { name: 'GIS' },
        update: {},
        create: { name: 'GIS', description: 'Geographic Information Systems' }
    });
    const skillSoilScience = await prisma.skill.upsert({
        where: { name: 'Soil Science' },
        update: {},
        create: { name: 'Soil Science', description: 'Soil health diagnostics and management' }
    });
    const skillFarmManagement = await prisma.skill.upsert({
        where: { name: 'Farm Management' },
        update: {},
        create: { name: 'Farm Management', description: 'Agricultural business and resource planning' }
    });
    const skillRemoteSensing = await prisma.skill.upsert({
        where: { name: 'Remote Sensing' },
        update: {},
        create: { name: 'Remote Sensing', description: 'Satellite imagery analysis' }
    });

    // Healthcare Skills
    const skillHealthIT = await prisma.skill.upsert({
        where: { name: 'Health IT' },
        update: {},
        create: { name: 'Health IT', description: 'Healthcare information technology systems' }
    });
    const skillEMR = await prisma.skill.upsert({
        where: { name: 'EMR/EHR' },
        update: {},
        create: { name: 'EMR/EHR', description: 'Electronic Medical/Health Records' }
    });
    const skillTelemedicine = await prisma.skill.upsert({
        where: { name: 'Telemedicine' },
        update: {},
        create: { name: 'Telemedicine', description: 'Remote healthcare delivery' }
    });
    const skillMedicalAI = await prisma.skill.upsert({
        where: { name: 'Medical AI' },
        update: {},
        create: { name: 'Medical AI', description: 'AI for medical image analysis and diagnostics' }
    });
    const skillDataAnalytics = await prisma.skill.upsert({
        where: { name: 'Data Analytics' },
        update: {},
        create: { name: 'Data Analytics', description: 'Healthcare and clinical data analysis' }
    });
    const skillCybersecurity = await prisma.skill.upsert({
        where: { name: 'Cybersecurity' },
        update: {},
        create: { name: 'Cybersecurity', description: 'Healthcare security and compliance' }
    });

    // Urban Technology Skills
    const skillTrafficSystems = await prisma.skill.upsert({
        where: { name: 'Traffic Systems' },
        update: {},
        create: { name: 'Traffic Systems', description: 'Intelligent traffic management' }
    });
    const skillUrbanPlanning = await prisma.skill.upsert({
        where: { name: 'Urban Planning' },
        update: {},
        create: { name: 'Urban Planning', description: 'Smart city planning and design' }
    });
    const skillWaterManagement = await prisma.skill.upsert({
        where: { name: 'Water Management' },
        update: {},
        create: { name: 'Water Management', description: 'Urban water distribution and quality' }
    });
    const skillWasteManagement = await prisma.skill.upsert({
        where: { name: 'Waste Management' },
        update: {},
        create: { name: 'Waste Management', description: 'Smart waste collection and recycling' }
    });
    const skillSmartGrid = await prisma.skill.upsert({
        where: { name: 'Smart Grid' },
        update: {},
        create: { name: 'Smart Grid', description: 'Urban energy management systems' }
    });
    const skillPublicTransport = await prisma.skill.upsert({
        where: { name: 'Public Transport' },
        update: {},
        create: { name: 'Public Transport', description: 'Urban mobility and transit analytics' }
    });

    // Common Tech Skills
    const skillPython = await prisma.skill.upsert({
        where: { name: 'Python' },
        update: {},
        create: { name: 'Python', description: 'Python programming for data and automation' }
    });
    const skillSQL = await prisma.skill.upsert({
        where: { name: 'SQL' },
        update: {},
        create: { name: 'SQL', description: 'Database querying and management' }
    });

    console.log('   ✅ 20 Skills created');

    // ========================================================================
    // MAP SKILLS TO COURSES (CourseSkill)
    // ========================================================================
    console.log('\n🔗 Mapping Skills to Courses...');

    // Define skill mappings by course title keywords
    const courseSkillMappings: Record<string, any[]> = {
        // Agriculture courses
        'Precision Agriculture with IoT': [skillIoT, skillSoilScience],
        'Agricultural Drones': [skillDrones, skillGIS, skillRemoteSensing],
        'Smart Greenhouse': [skillIoT, skillFarmManagement],
        'Soil Health': [skillSoilScience, skillGIS],
        'Farm Management': [skillFarmManagement, skillSQL],
        'Weather-Based': [skillDataAnalytics, skillFarmManagement],
        'Livestock Monitoring': [skillIoT, skillFarmManagement],
        'Supply Chain': [skillFarmManagement, skillDataAnalytics],
        'Remote Sensing': [skillRemoteSensing, skillGIS],
        'Organic Farming': [skillFarmManagement, skillSoilScience],

        // Healthcare courses
        'Hospital Information': [skillHealthIT, skillEMR, skillSQL],
        'Telemedicine': [skillTelemedicine, skillHealthIT],
        'Medical IoT': [skillIoT, skillHealthIT],
        'Healthcare Data Analytics': [skillDataAnalytics, skillSQL, skillPython],
        'AI-Powered Medical': [skillMedicalAI, skillPython, skillDataAnalytics],
        'Electronic Health Records': [skillEMR, skillHealthIT],
        'Public Health Surveillance': [skillDataAnalytics, skillHealthIT],
        'Pharmacy Management': [skillHealthIT, skillSQL],
        'Healthcare Cybersecurity': [skillCybersecurity, skillHealthIT],
        'Clinical Decision': [skillMedicalAI, skillDataAnalytics],

        // Urban courses
        'Smart Traffic': [skillTrafficSystems, skillIoT],
        'Urban IoT': [skillIoT, skillUrbanPlanning],
        'Water Management': [skillWaterManagement, skillIoT],
        'Waste Management': [skillWasteManagement, skillIoT],
        'Urban Mobility': [skillPublicTransport, skillDataAnalytics],
        'Smart City Platform': [skillUrbanPlanning, skillIoT],
        'Air Quality': [skillDataAnalytics, skillIoT],
        'Smart Parking': [skillIoT, skillUrbanPlanning],
        'Energy Management': [skillSmartGrid, skillIoT],
        'Citizen Engagement': [skillUrbanPlanning, skillDataAnalytics],
    };

    let skillMappingCount = 0;
    for (const course of createdCourses) {
        // Find matching skills based on course title
        for (const [keyword, skills] of Object.entries(courseSkillMappings)) {
            if (course.title.includes(keyword)) {
                for (const skill of skills) {
                    try {
                        await prisma.courseSkill.create({
                            data: {
                                courseId: course.id,
                                skillId: skill.id,
                            }
                        });
                        skillMappingCount++;
                    } catch (e) {
                        // Skip if already exists
                    }
                }
                break; // Only match first keyword
            }
        }
    }

    console.log(`   ✅ ${skillMappingCount} CourseSkill mappings created`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED COMPLETE!');
    console.log('='.repeat(60));
    console.log(`
📊 Summary:
   • Admin Users: 1
   • Domain Instructors: 9 (3 per domain)
   • Students: 3
   • Courses: 25 (5 per education level)
   • Assignments: ~225 (8-10 per course)
   • Reviews: ${reviewCount}
   • Skills: 20 (domain-specific)
   • CourseSkill Mappings: ${skillMappingCount}

🔑 Login Credentials:
   Admin:       admin@lms.com / admin123
   Instructors: [email]@lms.com / instructor123
   Students:    student1@lms.com / student123

🎓 Education Levels:
   • SECONDARY: 5 courses
   • HIGHER_SECONDARY: 5 courses
   • DIPLOMA: 5 courses
   • UNDERGRADUATE: 5 courses
   • POSTGRADUATE: 5 courses

🌾 Domains (balanced across levels):
   • Agriculture Technology
   • Healthcare Technology
   • Urban Technology
`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
