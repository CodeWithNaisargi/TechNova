import { PrismaClient, Role, EducationLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// PRODUCTION-GRADE SEED DATA
// Domains: Agriculture Technology, Healthcare Technology, Urban Technology
// ============================================================================

async function main() {
    console.log('🌱 Starting production seed...');
    console.log('📊 Domains: Agriculture, Healthcare, Urban Technology');

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
            bio: 'PhD in Agricultural Engineering from IIT Kharagpur. 15+ years experience in precision agriculture and smart farming systems. Former ICAR scientist with expertise in IoT-based crop monitoring.',
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
            bio: 'Agricultural Technology Specialist with expertise in drone-based farming and GIS applications. Consultant for NABARD and several AgriTech startups across India.',
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
            bio: 'Former Director of Agricultural Extension Services, Government of Maharashtra. Expert in soil health management, organic farming certification, and farmer training programs.',
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
            bio: 'MD, MPH from AIIMS Delhi. Health Informatics specialist with 12+ years in hospital information systems. Led digital transformation at Apollo Hospitals.',
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
            bio: 'Biomedical Engineer and Medical Device Expert. Former R&D lead at Philips Healthcare India. Specialist in wearable health monitoring and telemedicine systems.',
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
            bio: 'Healthcare Data Scientist with expertise in clinical analytics and AI in diagnostics. Previously at Microsoft Healthcare AI team. Published researcher in medical ML applications.',
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
            bio: 'Urban Planning PhD from IIT Bombay. Smart City consultant for 15+ cities under the Smart Cities Mission. Expert in sustainable urban infrastructure and public transport optimization.',
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
            bio: 'IoT and Smart Infrastructure Architect. Built traffic management systems for Bangalore and Hyderabad. Expert in sensor networks and real-time urban monitoring.',
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
            bio: 'Environmental Engineer specializing in urban waste management and water treatment. Advisor to Municipal Corporations on sustainable city infrastructure.',
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
    // AGRICULTURE TECHNOLOGY COURSES (10 courses)
    // ========================================================================
    console.log('\n🌾 Creating Agriculture Technology Courses...');

    const agriCourses = [
        {
            title: 'Precision Agriculture with IoT Sensors',
            description: 'Master the deployment of IoT sensor networks for real-time soil moisture, temperature, and nutrient monitoring. Learn to integrate data with automated irrigation systems for water conservation and yield optimization.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 4999,
            prerequisites: ['Basic electronics knowledge', 'Understanding of farming practices'],
            learningOutcomes: ['Deploy IoT sensor networks in agricultural fields', 'Analyze sensor data for crop health decisions', 'Integrate sensors with automated irrigation', 'Reduce water usage by 30-40% through smart monitoring'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Agricultural Drones: Mapping & Crop Analysis',
            description: 'Comprehensive training on drone technology for agricultural applications including field mapping, crop health assessment using NDVI imaging, and precision spraying techniques.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 5999,
            prerequisites: ['Basic computer skills', 'Interest in drone technology'],
            learningOutcomes: ['Operate agricultural drones safely', 'Create field maps using drone imagery', 'Analyze crop health using multispectral data', 'Plan precision spraying missions'],
            instructorId: agriInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
        },
        {
            title: 'Smart Greenhouse Management Systems',
            description: 'Design and implement automated greenhouse control systems including climate management, hydroponics integration, and AI-based growth optimization for year-round production.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Advanced',
            duration: '10 weeks',
            price: 6999,
            prerequisites: ['Basic programming knowledge', 'Understanding of plant biology'],
            learningOutcomes: ['Design automated greenhouse systems', 'Implement hydroponic growing systems', 'Use AI for growth optimization', 'Manage climate control systems'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Soil Health Diagnostics & Digital Mapping',
            description: 'Learn modern soil testing techniques, digital soil mapping using GIS, and data-driven fertilizer recommendations for sustainable agriculture.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Beginner',
            duration: '5 weeks',
            price: 3499,
            prerequisites: ['High school chemistry', 'Basic computer literacy'],
            learningOutcomes: ['Conduct digital soil testing', 'Create soil health maps using GIS', 'Interpret soil analysis reports', 'Generate fertilizer recommendations'],
            instructorId: agriInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
        },
        {
            title: 'Farm Management Information Systems (FMIS)',
            description: 'Implement comprehensive farm management software for resource planning, crop scheduling, financial tracking, and supply chain integration.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 4499,
            prerequisites: ['Basic accounting knowledge', 'Farming experience preferred'],
            learningOutcomes: ['Deploy farm management software', 'Track farm finances digitally', 'Plan crop rotations using data', 'Integrate with market platforms'],
            instructorId: agriInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Weather-Based Crop Advisory Systems',
            description: 'Build weather monitoring and forecasting systems that provide actionable advisories for farmers on sowing, irrigation, and pest management.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 3999,
            prerequisites: ['Basic statistics', 'Understanding of agricultural practices'],
            learningOutcomes: ['Set up weather monitoring stations', 'Analyze weather data for agriculture', 'Generate crop advisories', 'Build alert systems for farmers'],
            instructorId: agriInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Livestock Monitoring & Smart Dairy Technology',
            description: 'Implement IoT solutions for livestock health monitoring, automated feeding systems, and dairy farm digitization for improved productivity.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 4999,
            prerequisites: ['Basic animal husbandry knowledge', 'Interest in technology'],
            learningOutcomes: ['Deploy livestock tracking systems', 'Implement automated feeding', 'Monitor animal health remotely', 'Digitize dairy operations'],
            instructorId: agriInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
        },
        {
            title: 'Agricultural Supply Chain & Traceability',
            description: 'Learn blockchain and digital systems for farm-to-fork traceability, quality certification, and direct farmer-market linkage platforms.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Advanced',
            duration: '8 weeks',
            price: 5499,
            prerequisites: ['Understanding of supply chain concepts', 'Basic programming'],
            learningOutcomes: ['Implement traceability systems', 'Use blockchain for certification', 'Build farmer market platforms', 'Ensure quality compliance'],
            instructorId: agriInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Remote Sensing for Agriculture',
            description: 'Utilize satellite imagery and remote sensing data for large-scale crop monitoring, drought assessment, and agricultural policy planning.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Advanced',
            duration: '9 weeks',
            price: 6499,
            prerequisites: ['GIS fundamentals', 'Basic image processing knowledge'],
            learningOutcomes: ['Process satellite agricultural data', 'Assess crop health at scale', 'Predict yields using remote sensing', 'Support policy decisions with data'],
            instructorId: agriInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Organic Farming Certification & Digital Records',
            description: 'Navigate organic certification processes with digital documentation, compliance tracking, and quality management systems for organic producers.',
            category: 'AgriTech',
            domain: 'AGRICULTURE',
            difficulty: 'Beginner',
            duration: '4 weeks',
            price: 2999,
            prerequisites: ['Basic computer skills', 'Interest in organic farming'],
            learningOutcomes: ['Understand organic certification requirements', 'Maintain digital farm records', 'Track compliance digitally', 'Prepare for certification audits'],
            instructorId: agriInstructor3.id,
            hasProject: false,
            targetEducationLevel: EducationLevel.SECONDARY,
        },
    ];

    // ========================================================================
    // HEALTHCARE TECHNOLOGY COURSES (10 courses)
    // ========================================================================
    console.log('\n🏥 Creating Healthcare Technology Courses...');

    const healthCourses = [
        {
            title: 'Hospital Information Systems (HIS) Implementation',
            description: 'End-to-end training on implementing and managing hospital information systems including patient registration, EMR, billing, and laboratory integration.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '10 weeks',
            price: 7999,
            prerequisites: ['Healthcare domain knowledge', 'Basic IT skills'],
            learningOutcomes: ['Implement HIS modules', 'Configure EMR systems', 'Integrate laboratory systems', 'Manage healthcare data workflows'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Telemedicine Platform Development',
            description: 'Build secure telemedicine solutions including video consultation, prescription management, and remote patient monitoring features compliant with healthcare regulations.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '12 weeks',
            price: 8999,
            prerequisites: ['Web development basics', 'Understanding of healthcare delivery'],
            learningOutcomes: ['Build video consultation systems', 'Implement e-prescription features', 'Ensure HIPAA/data compliance', 'Deploy secure telemedicine apps'],
            instructorId: healthInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Medical IoT & Wearable Health Devices',
            description: 'Design and integrate wearable health monitoring devices for continuous vital sign tracking, fall detection, and chronic disease management.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 5999,
            prerequisites: ['Basic electronics', 'Programming fundamentals'],
            learningOutcomes: ['Interface with health sensors', 'Process biomedical signals', 'Build health monitoring dashboards', 'Ensure medical device safety'],
            instructorId: healthInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Healthcare Data Analytics & Visualization',
            description: 'Analyze clinical data sets for patient outcomes, disease trends, and operational efficiency using modern analytics tools and visualization techniques.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 5499,
            prerequisites: ['Basic statistics', 'Spreadsheet proficiency'],
            learningOutcomes: ['Analyze clinical datasets', 'Create healthcare dashboards', 'Identify patient outcome patterns', 'Support evidence-based decisions'],
            instructorId: healthInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'AI-Powered Medical Image Analysis',
            description: 'Apply deep learning techniques for medical image analysis including X-ray interpretation, CT scan analysis, and pathology slide screening.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '10 weeks',
            price: 9999,
            prerequisites: ['Python programming', 'Machine learning basics'],
            learningOutcomes: ['Preprocess medical images', 'Train diagnostic AI models', 'Validate model performance', 'Deploy AI in clinical workflows'],
            instructorId: healthInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Electronic Health Records (EHR) Management',
            description: 'Master the administration of EHR systems including data migration, interoperability standards (HL7/FHIR), and clinical documentation best practices.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 4999,
            prerequisites: ['IT administration basics', 'Healthcare workflow understanding'],
            learningOutcomes: ['Administer EHR systems', 'Migrate patient data safely', 'Implement HL7/FHIR standards', 'Train clinical users'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Public Health Surveillance Systems',
            description: 'Build disease surveillance and outbreak monitoring systems for public health authorities using real-time data collection and epidemiological analysis.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '9 weeks',
            price: 6499,
            prerequisites: ['Epidemiology basics', 'Database management'],
            learningOutcomes: ['Design surveillance systems', 'Collect outbreak data in real-time', 'Perform epidemiological analysis', 'Generate public health alerts'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Pharmacy Management & Drug Inventory Systems',
            description: 'Implement digital pharmacy management including inventory tracking, drug interaction checking, and prescription fulfillment automation.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Beginner',
            duration: '5 weeks',
            price: 3999,
            prerequisites: ['Basic pharmacy knowledge', 'Computer literacy'],
            learningOutcomes: ['Set up pharmacy software', 'Track drug inventory digitally', 'Check drug interactions', 'Automate dispensing workflows'],
            instructorId: healthInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.DIPLOMA,
        },
        {
            title: 'Healthcare Cybersecurity & Compliance',
            description: 'Protect healthcare systems from cyber threats while ensuring compliance with HIPAA, GDPR, and local health data protection regulations.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 5499,
            prerequisites: ['IT security basics', 'Healthcare data understanding'],
            learningOutcomes: ['Assess healthcare cyber risks', 'Implement security controls', 'Ensure regulatory compliance', 'Respond to security incidents'],
            instructorId: healthInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Clinical Decision Support Systems',
            description: 'Design and implement clinical decision support tools that assist physicians in diagnosis, treatment recommendations, and care pathway optimization.',
            category: 'HealthTech',
            domain: 'HEALTHCARE',
            difficulty: 'Advanced',
            duration: '8 weeks',
            price: 7499,
            prerequisites: ['Clinical knowledge', 'Data analytics skills'],
            learningOutcomes: ['Build decision support algorithms', 'Integrate with EMR systems', 'Validate clinical recommendations', 'Measure care quality impact'],
            instructorId: healthInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
    ];

    // ========================================================================
    // URBAN TECHNOLOGY COURSES (10 courses)
    // ========================================================================
    console.log('\n🏙️ Creating Urban Technology Courses...');

    const urbanCourses = [
        {
            title: 'Smart Traffic Management Systems',
            description: 'Design and implement intelligent traffic monitoring and control systems using sensors, cameras, and AI-based signal optimization for congestion reduction.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '8 weeks',
            price: 5999,
            prerequisites: ['Basic programming', 'Understanding of traffic flow'],
            learningOutcomes: ['Deploy traffic sensors', 'Analyze traffic patterns', 'Optimize signal timing with AI', 'Reduce urban congestion'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Urban IoT Infrastructure & Sensor Networks',
            description: 'Build city-wide IoT networks for environmental monitoring, smart lighting, and infrastructure health tracking with scalable architecture.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Advanced',
            duration: '10 weeks',
            price: 7499,
            prerequisites: ['Networking fundamentals', 'IoT basics'],
            learningOutcomes: ['Design city-scale IoT networks', 'Deploy environmental sensors', 'Implement smart lighting systems', 'Monitor infrastructure health'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Sustainable Urban Water Management',
            description: 'Implement smart water distribution and quality monitoring systems including leak detection, consumption tracking, and wastewater treatment optimization.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 4999,
            prerequisites: ['Basic hydrology', 'Data analysis skills'],
            learningOutcomes: ['Deploy water quality sensors', 'Detect pipeline leaks digitally', 'Optimize water distribution', 'Monitor treatment processes'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Smart Waste Management & Recycling Systems',
            description: 'Design intelligent waste collection routing, bin monitoring, and recycling tracking systems for sustainable urban waste management.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Beginner',
            duration: '5 weeks',
            price: 3499,
            prerequisites: ['Basic environmental science', 'Computer literacy'],
            learningOutcomes: ['Monitor waste bin levels', 'Optimize collection routes', 'Track recycling rates', 'Reduce waste management costs'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
        },
        {
            title: 'Urban Mobility & Public Transport Analytics',
            description: 'Analyze and optimize public transportation networks using ridership data, real-time tracking, and multimodal integration for improved urban mobility.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '7 weeks',
            price: 4999,
            prerequisites: ['Data analysis basics', 'Interest in transportation'],
            learningOutcomes: ['Analyze ridership patterns', 'Optimize bus/metro routes', 'Implement real-time tracking', 'Plan multimodal integration'],
            instructorId: urbanInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Smart City Platform Architecture',
            description: 'Design integrated smart city platforms that unify multiple urban services including safety, mobility, utilities, and citizen engagement.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Advanced',
            duration: '12 weeks',
            price: 9499,
            prerequisites: ['System architecture knowledge', 'Project management skills'],
            learningOutcomes: ['Design integrated city platforms', 'Unify urban data sources', 'Build citizen engagement portals', 'Manage smart city projects'],
            instructorId: urbanInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Urban Air Quality Monitoring & Analysis',
            description: 'Deploy air quality monitoring networks and build analytics systems for pollution tracking, source identification, and health impact assessment.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 4499,
            prerequisites: ['Environmental science basics', 'Data visualization skills'],
            learningOutcomes: ['Deploy AQI monitoring stations', 'Analyze pollution data', 'Identify pollution sources', 'Generate public health advisories'],
            instructorId: urbanInstructor3.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
        },
        {
            title: 'Smart Parking & Urban Space Optimization',
            description: 'Implement intelligent parking solutions using sensors and apps for real-time availability, dynamic pricing, and space utilization analytics.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Beginner',
            duration: '4 weeks',
            price: 2999,
            prerequisites: ['Basic app usage', 'Interest in urban planning'],
            learningOutcomes: ['Deploy parking sensors', 'Build parking finder apps', 'Implement dynamic pricing', 'Analyze space utilization'],
            instructorId: urbanInstructor2.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.HIGHER_SECONDARY,
        },
        {
            title: 'Urban Energy Management & Smart Grids',
            description: 'Design smart grid systems for urban electricity distribution including demand forecasting, renewable integration, and consumption optimization.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Advanced',
            duration: '9 weeks',
            price: 6999,
            prerequisites: ['Electrical engineering basics', 'Data analysis skills'],
            learningOutcomes: ['Design smart grid architectures', 'Forecast energy demand', 'Integrate renewable sources', 'Optimize energy distribution'],
            instructorId: urbanInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.POSTGRADUATE,
        },
        {
            title: 'Citizen Engagement & Digital Governance',
            description: 'Build digital platforms for citizen grievance management, participatory budgeting, and transparent governance with mobile and web interfaces.',
            category: 'UrbanTech',
            domain: 'URBAN',
            difficulty: 'Intermediate',
            duration: '6 weeks',
            price: 3999,
            prerequisites: ['Web development basics', 'Understanding of governance'],
            learningOutcomes: ['Build grievance portals', 'Implement participatory budgeting', 'Create transparency dashboards', 'Enable mobile governance'],
            instructorId: urbanInstructor1.id,
            hasProject: true,
            targetEducationLevel: EducationLevel.UNDERGRADUATE,
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
        },
    ];

    // ========================================================================
    // CREATE COURSES WITH ASSIGNMENTS
    // ========================================================================
    const allCourseData = [...agriCourses, ...healthCourses, ...urbanCourses, ...explorationCourses];
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
                tags: courseData.domain
                    ? [courseData.domain.toLowerCase(), courseData.category.toLowerCase()]
                    : [courseData.category.toLowerCase()],
            },
        });
        createdCourses.push(course);

        // Create 8-10 assignments per course
        const assignmentCount = Math.floor(Math.random() * 3) + 8; // 8-10 assignments
        const assignmentTypes = ['Quiz', 'Assignment', 'Project', 'Case Study', 'Lab Exercise'];

        for (let i = 1; i <= assignmentCount; i++) {
            const assignmentType = assignmentTypes[Math.floor(Math.random() * assignmentTypes.length)];
            await prisma.assignment.create({
                data: {
                    title: `${assignmentType} ${i}: ${courseData.title.split(':')[0]} - Week ${Math.ceil(i / 2)}`,
                    description: `Complete this ${assignmentType.toLowerCase()} to demonstrate your understanding of the concepts covered. Apply practical skills learned in the module.`,
                    dueDate: new Date(Date.now() + (7 * i * 24 * 60 * 60 * 1000)), // i weeks from now
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
        { rating: 5, comment: 'The instructor explains complex concepts clearly. Highly recommended for professionals.' },
        { rating: 4, comment: 'Great content and well-structured. Would love more advanced topics in future updates.' },
        { rating: 4, comment: 'Very practical approach. The case studies were particularly valuable.' },
        { rating: 5, comment: 'This course transformed my understanding of the subject. Worth every rupee!' },
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
   • Courses: 30 (10 per domain)
   • Assignments: ~270 (8-10 per course)
   • Reviews: ${reviewCount}
   • Skills: 20 (domain-specific)
   • CourseSkill Mappings: ${skillMappingCount}

🔑 Login Credentials:
   Admin:       admin@lms.com / admin123
   Instructors: [email]@lms.com / instructor123
   Students:    student1@lms.com / student123

🌾 Domains:
   • Agriculture Technology (10 courses)
   • Healthcare Technology (10 courses)
   • Urban Technology (10 courses)

🧠 Recommendation Engine:
   • Content-based filtering with cosine similarity
   • Feature vectors: education, skills, domain, difficulty
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
