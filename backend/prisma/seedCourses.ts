import { PrismaClient, Role, EducationLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateCoursesForLevelAndDomain, generateReviews, generateAssignments, CourseDomain } from './courseGenerator';

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
    await prisma.courseSkill.deleteMany({});
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
    console.log('🔑 Hashing passwords...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    console.log('   ✅ Passwords hashed');

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

    const agriInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.priya.sharma@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.priya.sharma@lms.com', password: instructorPassword, name: 'Dr. Priya Sharma', role: Role.INSTRUCTOR,
            bio: 'PhD in Agricultural Engineering. Expert in precision agriculture.', isEmailVerified: true,
        },
    });
    const agriInstructor2 = await prisma.user.upsert({
        where: { email: 'rajesh.kumar@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'rajesh.kumar@lms.com', password: instructorPassword, name: 'Rajesh Kumar', role: Role.INSTRUCTOR,
            bio: 'Agri-Tech Specialist. Expert in drone farming.', isEmailVerified: true,
        },
    });
    const agriInstructor3 = await prisma.user.upsert({
        where: { email: 'dr.anita.desai@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.anita.desai@lms.com', password: instructorPassword, name: 'Dr. Anita Desai', role: Role.INSTRUCTOR,
            bio: 'Expert in soil health and organic farming.', isEmailVerified: true,
        },
    });

    const healthInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.vikram.mehta@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.vikram.mehta@lms.com', password: instructorPassword, name: 'Dr. Vikram Mehta', role: Role.INSTRUCTOR,
            bio: 'Health Informatics specialist from AIIMS Delhi.', isEmailVerified: true,
        },
    });
    const healthInstructor2 = await prisma.user.upsert({
        where: { email: 'dr.sneha.patil@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.sneha.patil@lms.com', password: instructorPassword, name: 'Dr. Sneha Patil', role: Role.INSTRUCTOR,
            bio: 'Biomedical Engineer and Medical Device Expert.', isEmailVerified: true,
        },
    });
    const healthInstructor3 = await prisma.user.upsert({
        where: { email: 'arun.nair@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'arun.nair@lms.com', password: instructorPassword, name: 'Arun Nair', role: Role.INSTRUCTOR,
            bio: 'Healthcare Data Scientist and AI diagnostic expert.', isEmailVerified: true,
        },
    });

    const urbanInstructor1 = await prisma.user.upsert({
        where: { email: 'dr.meera.iyer@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.meera.iyer@lms.com', password: instructorPassword, name: 'Dr. Meera Iyer', role: Role.INSTRUCTOR,
            bio: 'Urban Planning PhD. Smart City consultant.', isEmailVerified: true,
        },
    });
    const urbanInstructor2 = await prisma.user.upsert({
        where: { email: 'sanjay.verma@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'sanjay.verma@lms.com', password: instructorPassword, name: 'Sanjay Verma', role: Role.INSTRUCTOR,
            bio: 'IoT and Smart Infrastructure Architect.', isEmailVerified: true,
        },
    });
    const urbanInstructor3 = await prisma.user.upsert({
        where: { email: 'dr.kavita.singh@lms.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'dr.kavita.singh@lms.com', password: instructorPassword, name: 'Dr. Kavita Singh', role: Role.INSTRUCTOR,
            bio: 'Environmental Engineer specializing in urban waste management.', isEmailVerified: true,
        },
    });

    console.log('   ✅ 9 Domain Instructors created');

    const instructorGroups: Record<CourseDomain, string[]> = {
        AGRICULTURE: [agriInstructor1.id, agriInstructor2.id, agriInstructor3.id],
        HEALTHCARE: [healthInstructor1.id, healthInstructor2.id, healthInstructor3.id],
        URBAN: [urbanInstructor1.id, urbanInstructor2.id, urbanInstructor3.id]
    };

    // ========================================================================
    // STUDENT USERS
    // ========================================================================
    console.log('\n👨‍ STUDENT USERS...');
    const student1 = await prisma.user.upsert({
        where: { email: 'student1@lms.com' }, update: { isEmailVerified: true },
        create: { email: 'student1@lms.com', password: studentPassword, name: 'Amit Patel', role: Role.STUDENT, isEmailVerified: true, educationLevel: EducationLevel.UNDERGRADUATE },
    });
    const student2 = await prisma.user.upsert({
        where: { email: 'student2@lms.com' }, update: { isEmailVerified: true },
        create: { email: 'student2@lms.com', password: studentPassword, name: 'Priya Menon', role: Role.STUDENT, isEmailVerified: true, educationLevel: EducationLevel.POSTGRADUATE },
    });
    const student3 = await prisma.user.upsert({
        where: { email: 'student3@lms.com' }, update: { isEmailVerified: true },
        create: { email: 'student3@lms.com', password: studentPassword, name: 'Rahul Sharma', role: Role.STUDENT, isEmailVerified: true, educationLevel: EducationLevel.UNDERGRADUATE },
    });
    console.log('   ✅ 3 Students created');

    // ========================================================================
    // CREATE SKILLS
    // ========================================================================
    console.log('\n🧠 Creating Skills...');
    const skillsToCreate = [
        { name: 'IoT', description: 'Internet of Things' },
        { name: 'Drone', description: 'Unmanned Aerial Vehicles' },
        { name: 'GIS', description: 'Geographic Information Systems' },
        { name: 'Remote Sensing', description: 'Satellite imagery analysis' },
        { name: 'Data Analytics', description: 'Data analysis and visualization' },
        { name: 'EMR', description: 'Electronic Medical Records' },
        { name: 'Traffic', description: 'Traffic management systems' },
        { name: 'Smart City', description: 'Smart city infrastructure' },
        { name: 'Water Management', description: 'Urban water systems' },
        { name: 'AI', description: 'Artificial Intelligence' },
        { name: 'Blockchain', description: 'Distributed ledger technology' },
    ];
    const createdSkills: Record<string, any> = {};
    for (const s of skillsToCreate) {
        createdSkills[s.name] = await prisma.skill.upsert({ where: { name: s.name }, update: {}, create: s });
    }
    console.log('   ✅ Skills created');

    let totalCourses = 0;
    let totalAssignments = 0;
    let totalReviews = 0;
    let totalSkillMappings = 0;

    // ========================================================================
    // FOUNDATIONAL COURSES (25 Legacy)
    // ========================================================================
    console.log('\n📚 Creating Foundational Courses...');
    const legacyCourses = [
        { title: 'Introduction to Smart Farming', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Beginner', duration: '4 weeks', price: 999, instructorId: agriInstructor3.id, targetEducationLevel: EducationLevel.SECONDARY, thumbnail: '/course-images/agri_intro_smart_farming.jpg' },
        { title: 'Digital Health Basics', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Beginner', duration: '3 weeks', price: 799, instructorId: healthInstructor2.id, targetEducationLevel: EducationLevel.SECONDARY, thumbnail: '/course-images/health_digital_basics.jpg' },
        { title: 'Smart Cities 101', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Beginner', duration: '3 weeks', price: 799, instructorId: urbanInstructor1.id, targetEducationLevel: EducationLevel.SECONDARY, thumbnail: '/course-images/urban_smart_cities_101.jpg' },
        { title: 'Organic Farming Awareness', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Beginner', duration: '3 weeks', price: 699, instructorId: agriInstructor3.id, targetEducationLevel: EducationLevel.SECONDARY, thumbnail: '/course-images/agri_organic_awareness.jpg' },
        { title: 'First Aid & Emergency Apps', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Beginner', duration: '2 weeks', price: 599, instructorId: healthInstructor1.id, targetEducationLevel: EducationLevel.SECONDARY, thumbnail: '/course-images/health_first_aid_apps.jpg' },
        { title: 'Agricultural Drones: Mapping & Crop Analysis', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Intermediate', duration: '6 weeks', price: 2999, instructorId: agriInstructor2.id, targetEducationLevel: EducationLevel.HIGHER_SECONDARY, thumbnail: '/course-images/agri_drones_mapping.jpg' },
        { title: 'Pharmacy Management Fundamentals', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Beginner', duration: '5 weeks', price: 2499, instructorId: healthInstructor2.id, targetEducationLevel: EducationLevel.HIGHER_SECONDARY, thumbnail: '/course-images/health_pharmacy_mgmt.jpg' },
        { title: 'Smart Waste Management & Recycling', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Beginner', duration: '4 weeks', price: 1999, instructorId: urbanInstructor3.id, targetEducationLevel: EducationLevel.HIGHER_SECONDARY, thumbnail: '/course-images/urban_waste_mgmt.jpg' },
        { title: 'Soil Health & Digital Testing', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Beginner', duration: '5 weeks', price: 2299, instructorId: agriInstructor3.id, targetEducationLevel: EducationLevel.HIGHER_SECONDARY, thumbnail: '/course-images/agri_soil_digital.jpg' },
        { title: 'Smart Parking Systems', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Beginner', duration: '4 weeks', price: 1799, instructorId: urbanInstructor2.id, targetEducationLevel: EducationLevel.HIGHER_SECONDARY, thumbnail: '/course-images/urban_smart_parking.jpg' },
        { title: 'Livestock Monitoring & Smart Dairy Technology', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Intermediate', duration: '7 weeks', price: 4999, instructorId: agriInstructor1.id, targetEducationLevel: EducationLevel.DIPLOMA, thumbnail: '/course-images/agri_livestock_iot.jpg' },
        { title: 'Medical Equipment Maintenance', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Intermediate', duration: '8 weeks', price: 5999, instructorId: healthInstructor2.id, targetEducationLevel: EducationLevel.DIPLOMA, thumbnail: '/course-images/health_equipment_maint.jpg' },
        { title: 'Traffic Sensor Installation & Maintenance', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Intermediate', duration: '6 weeks', price: 4499, instructorId: urbanInstructor2.id, targetEducationLevel: EducationLevel.DIPLOMA, thumbnail: '/course-images/urban_traffic_sensors.jpg' },
        { title: 'Greenhouse Climate Control Systems', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Intermediate', duration: '6 weeks', price: 4299, instructorId: agriInstructor1.id, targetEducationLevel: EducationLevel.DIPLOMA, thumbnail: '/course-images/agri_greenhouse_climate.jpg' },
        { title: 'Water Quality Monitoring Technician', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Intermediate', duration: '5 weeks', price: 3999, instructorId: urbanInstructor3.id, targetEducationLevel: EducationLevel.DIPLOMA, thumbnail: '/course-images/urban_water_quality.jpg' },
        { title: 'Precision Agriculture with IoT Sensors', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Intermediate', duration: '8 weeks', price: 6999, instructorId: agriInstructor1.id, targetEducationLevel: EducationLevel.UNDERGRADUATE, thumbnail: '/course-images/agri_precision_iot.jpg' },
        { title: 'Electronic Health Records (EHR) Management', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Intermediate', duration: '7 weeks', price: 7499, instructorId: healthInstructor1.id, targetEducationLevel: EducationLevel.UNDERGRADUATE, thumbnail: '/course-images/health_ehr_mgmt.jpg' },
        { title: 'Smart Traffic Management Systems', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Intermediate', duration: '8 weeks', price: 6999, instructorId: urbanInstructor2.id, targetEducationLevel: EducationLevel.UNDERGRADUATE, thumbnail: '/course-images/urban_traffic_mgmt.jpg' },
        { title: 'Healthcare Data Analytics & Visualization', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Intermediate', duration: '7 weeks', price: 6499, instructorId: healthInstructor3.id, targetEducationLevel: EducationLevel.UNDERGRADUATE, thumbnail: '/course-images/health_data_analytics.jpg' },
        { title: 'Urban Air Quality Monitoring', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Intermediate', duration: '6 weeks', price: 5499, instructorId: urbanInstructor3.id, targetEducationLevel: EducationLevel.UNDERGRADUATE, thumbnail: '/course-images/urban_air_quality.jpg' },
        { title: 'Agricultural Supply Chain & Blockchain Traceability', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Advanced', duration: '10 weeks', price: 12999, instructorId: agriInstructor3.id, targetEducationLevel: EducationLevel.POSTGRADUATE, thumbnail: '/course-images/agri_blockchain_supply.jpg' },
        { title: 'AI-Powered Medical Image Analysis', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Advanced', duration: '12 weeks', price: 14999, instructorId: healthInstructor3.id, targetEducationLevel: EducationLevel.POSTGRADUATE, thumbnail: '/course-images/health_ai_imaging.jpg' },
        { title: 'Smart City Platform Architecture', category: 'UrbanTech', domain: 'URBAN', difficulty: 'Advanced', duration: '12 weeks', price: 14999, instructorId: urbanInstructor1.id, targetEducationLevel: EducationLevel.POSTGRADUATE, thumbnail: '/course-images/urban_smart_platform.jpg' },
        { title: 'Remote Sensing for Agricultural Policy', category: 'AgriTech', domain: 'AGRICULTURE', difficulty: 'Advanced', duration: '10 weeks', price: 11999, instructorId: agriInstructor2.id, targetEducationLevel: EducationLevel.POSTGRADUATE, thumbnail: '/course-images/agri_remote_sensing.jpg' },
        { title: 'Hospital Information Systems Architecture', category: 'HealthTech', domain: 'HEALTHCARE', difficulty: 'Advanced', duration: '12 weeks', price: 13999, instructorId: healthInstructor1.id, targetEducationLevel: EducationLevel.POSTGRADUATE, thumbnail: '/course-images/health_his_architecture.jpg' },
    ];

    for (const c of legacyCourses) {
        const createdCourse = await prisma.course.create({
            data: { ...c, description: `Foundational course: ${c.title}.`, isPublished: true, tags: [c.domain.toLowerCase(), c.category.toLowerCase()] }
        });
        totalCourses++;
        const assignments = generateAssignments(createdCourse.id, createdCourse.title);
        await prisma.assignment.createMany({ data: assignments });
        totalAssignments += assignments.length;
        const reviews = generateReviews(createdCourse.id, c.targetEducationLevel);
        for (const r of reviews) {
            const student = [student1, student2, student3][Math.floor(Math.random() * 3)];
            await prisma.review.create({ data: { rating: Math.floor(r.rating), comment: r.comment, courseId: createdCourse.id, userId: student.id } });
            totalReviews++;
        }
    }
    console.log('   ✅ 25 Foundational courses created');

    // ========================================================================
    // ENGINE GENERATION (150 NEW)
    // ========================================================================
    console.log('\n📚 Generating 150 NEW Courses...');
    const levels: EducationLevel[] = [EducationLevel.SECONDARY, EducationLevel.HIGHER_SECONDARY, EducationLevel.DIPLOMA, EducationLevel.UNDERGRADUATE, EducationLevel.POSTGRADUATE];
    const domains: CourseDomain[] = ['AGRICULTURE', 'HEALTHCARE', 'URBAN'];

    for (const level of levels) {
        console.log(`\n🎓 Processing Level: ${level}...`);
        for (const domain of domains) {
            console.log(`   🚜 Domain: ${domain}...`);
            const courseBatch = generateCoursesForLevelAndDomain(level, domain, instructorGroups[domain]);
            for (const c of courseBatch) {
                const { thumbnailPrompt: _prompt, ...courseData } = c;
                const createdCourse = await prisma.course.create({
                    data: courseData
                });
                totalCourses++;
                process.stdout.write('.');
                const assignments = generateAssignments(createdCourse.id, createdCourse.title);
                await prisma.assignment.createMany({ data: assignments });
                totalAssignments += assignments.length;
                const reviews = generateReviews(createdCourse.id, level);
                for (const r of reviews) {
                    const student = [student1, student2, student3][Math.floor(Math.random() * 3)];
                    await prisma.review.create({ data: { rating: Math.floor(r.rating), comment: r.comment, courseId: createdCourse.id, userId: student.id } });
                    totalReviews++;
                }
                for (const [skillName, skill] of Object.entries(createdSkills) as any) {
                    if (createdCourse.title.toLowerCase().includes(skillName.toLowerCase()) || createdCourse.description.toLowerCase().includes(skillName.toLowerCase())) {
                        try { await prisma.courseSkill.create({ data: { courseId: createdCourse.id, skillId: skill.id } }); totalSkillMappings++; } catch (e) { }
                    }
                }
            }
            console.log(`   ✅ ${domain} batch complete`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED PROCESS COMPLETE!');
    console.log(`• Total courses:     ${totalCourses}`);
    console.log(`• Total assignments: ${totalAssignments}`);
    console.log(`• Total reviews:     ${totalReviews}`);
    console.log(`• Skill mappings:    ${totalSkillMappings}`);
    console.log('='.repeat(60));
}

main().catch((e) => { console.error('❌ Error:', e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
