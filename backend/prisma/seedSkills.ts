import { PrismaClient } from '@prisma/client';

declare const process: any;

const prisma = new PrismaClient();

/**
 * Seed Skills Data
 * This script populates:
 * 1. Skills (master list)
 * 2. CourseSkill (links courses to skills they teach)
 * 3. CareerSkill (links career paths to required skills)
 */

async function main() {
    console.log('🎯 Seeding Skills Data...');

    // ========================================================================
    // SKILLS BY DOMAIN
    // ========================================================================
    const skillsData = [
        // AGRICULTURE SKILLS
        { name: 'IoT Sensors', description: 'Internet of Things sensor deployment' },
        { name: 'Precision Agriculture', description: 'Data-driven farming techniques' },
        { name: 'Drone Operations', description: 'Agricultural drone piloting and mapping' },
        { name: 'Soil Analysis', description: 'Digital soil testing and interpretation' },
        { name: 'Crop Monitoring', description: 'Remote crop health assessment' },
        { name: 'Irrigation Systems', description: 'Automated irrigation technology' },
        { name: 'GIS Mapping', description: 'Geographic Information Systems for farming' },
        { name: 'Livestock Management', description: 'Digital livestock tracking' },
        { name: 'Supply Chain', description: 'Agricultural supply chain logistics' },
        { name: 'Blockchain Traceability', description: 'Farm-to-fork tracking systems' },

        // HEALTHCARE SKILLS
        { name: 'EHR Systems', description: 'Electronic Health Records management' },
        { name: 'Medical Imaging', description: 'Medical image analysis and interpretation' },
        { name: 'Health Informatics', description: 'Healthcare data systems' },
        { name: 'Clinical Analytics', description: 'Healthcare data analytics' },
        { name: 'Medical Devices', description: 'Medical equipment operation' },
        { name: 'Telemedicine', description: 'Remote healthcare delivery' },
        { name: 'HIPAA Compliance', description: 'Healthcare data privacy' },
        { name: 'HL7/FHIR', description: 'Healthcare data interoperability' },
        { name: 'AI Diagnostics', description: 'AI-powered medical diagnosis' },
        { name: 'Patient Care', description: 'Patient care management' },

        // URBAN TECHNOLOGY SKILLS
        { name: 'Smart City Planning', description: 'Urban digital infrastructure' },
        { name: 'Traffic Management', description: 'Intelligent traffic systems' },
        { name: 'IoT Infrastructure', description: 'City-scale IoT deployment' },
        { name: 'Data Analytics', description: 'Urban data analysis' },
        { name: 'Air Quality Monitoring', description: 'Environmental sensor systems' },
        { name: 'Waste Management', description: 'Smart waste collection' },
        { name: 'Water Quality', description: 'Water monitoring systems' },
        { name: 'Citizen Services', description: 'Digital citizen engagement' },
        { name: 'Smart Parking', description: 'Intelligent parking systems' },
        { name: 'Energy Management', description: 'Smart grid and energy systems' },
    ];

    console.log('\n📚 Creating Skills...');
    const skills: Record<string, string> = {};

    for (const skillData of skillsData) {
        const skill = await prisma.skill.upsert({
            where: { name: skillData.name },
            update: {},
            create: skillData
        });
        skills[skill.name] = skill.id;
    }
    console.log(`   ✅ ${Object.keys(skills).length} Skills created/verified`);

    // ========================================================================
    // LINK COURSES TO SKILLS
    // ========================================================================
    console.log('\n🔗 Linking Courses to Skills...');

    // Get all courses
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, domain: true, category: true }
    });

    // Skill mapping by keywords in course titles
    const courseSkillMap: Record<string, string[]> = {
        // Agriculture courses
        'Smart Farming': ['IoT Sensors', 'Precision Agriculture', 'Crop Monitoring'],
        'Drones': ['Drone Operations', 'GIS Mapping', 'Crop Monitoring'],
        'Soil': ['Soil Analysis', 'Precision Agriculture'],
        'Livestock': ['Livestock Management', 'IoT Sensors'],
        'Greenhouse': ['IoT Sensors', 'Irrigation Systems'],
        'Blockchain': ['Blockchain Traceability', 'Supply Chain'],
        'Remote Sensing': ['GIS Mapping', 'Crop Monitoring', 'Drone Operations'],
        'Precision Agriculture': ['Precision Agriculture', 'IoT Sensors', 'Irrigation Systems'],
        'Organic': ['Soil Analysis', 'Crop Monitoring'],

        // Healthcare courses
        'EHR': ['EHR Systems', 'Health Informatics', 'HL7/FHIR'],
        'Electronic Health': ['EHR Systems', 'Health Informatics', 'HL7/FHIR'],
        'Medical Image': ['Medical Imaging', 'AI Diagnostics'],
        'AI-Powered': ['AI Diagnostics', 'Clinical Analytics'],
        'Data Analytics': ['Clinical Analytics', 'Data Analytics', 'Health Informatics'],
        'Medical Equipment': ['Medical Devices', 'Patient Care'],
        'Pharmacy': ['Health Informatics', 'Patient Care'],
        'Digital Health': ['Telemedicine', 'Health Informatics'],
        'Hospital Information': ['EHR Systems', 'Health Informatics', 'HIPAA Compliance'],
        'Telemedicine': ['Telemedicine', 'Patient Care'],
        'First Aid': ['Patient Care'],

        // Urban courses
        'Smart Cities': ['Smart City Planning', 'IoT Infrastructure'],
        'Traffic': ['Traffic Management', 'IoT Infrastructure', 'Data Analytics'],
        'Air Quality': ['Air Quality Monitoring', 'Data Analytics', 'IoT Infrastructure'],
        'Waste': ['Waste Management', 'IoT Infrastructure'],
        'Water Quality': ['Water Quality', 'IoT Infrastructure'],
        'Parking': ['Smart Parking', 'IoT Infrastructure'],
        'Smart City Platform': ['Smart City Planning', 'IoT Infrastructure', 'Citizen Services', 'Data Analytics'],
    };

    let linkedCount = 0;
    for (const course of courses) {
        const matchingSkills: string[] = [];

        // Find skills that match course title keywords
        for (const [keyword, skillNames] of Object.entries(courseSkillMap)) {
            if (course.title.includes(keyword)) {
                matchingSkills.push(...skillNames);
            }
        }

        // Deduplicate
        const uniqueSkills = [...new Set(matchingSkills)];

        // Create CourseSkill links
        for (const skillName of uniqueSkills) {
            if (skills[skillName]) {
                try {
                    await prisma.courseSkill.upsert({
                        where: {
                            courseId_skillId: {
                                courseId: course.id,
                                skillId: skills[skillName]
                            }
                        },
                        update: {},
                        create: {
                            courseId: course.id,
                            skillId: skills[skillName]
                        }
                    });
                    linkedCount++;
                } catch (e) {
                    // Ignore duplicate errors
                }
            }
        }
    }
    console.log(`   ✅ ${linkedCount} Course-Skill links created`);

    // ========================================================================
    // LINK CAREER PATHS TO SKILLS
    // ========================================================================
    console.log('\n🎯 Linking Career Paths to Skills...');

    const careerPaths = await prisma.careerPath.findMany({
        select: { id: true, title: true, domain: true }
    });

    // Career skill requirements based on domain
    const careerSkillRequirements: Record<string, string[]> = {
        'AGRICULTURE': ['Precision Agriculture', 'IoT Sensors', 'Crop Monitoring', 'Drone Operations', 'GIS Mapping'],
        'HEALTHCARE': ['EHR Systems', 'Health Informatics', 'Clinical Analytics', 'Medical Devices', 'Telemedicine'],
        'URBAN': ['Smart City Planning', 'Traffic Management', 'IoT Infrastructure', 'Data Analytics', 'Citizen Services'],
        'TECH': ['Data Analytics', 'IoT Infrastructure', 'AI Diagnostics'],
    };

    let careerLinked = 0;
    for (const career of careerPaths) {
        const requiredSkills = careerSkillRequirements[career.domain] || [];

        for (const skillName of requiredSkills) {
            if (skills[skillName]) {
                try {
                    await prisma.careerSkill.upsert({
                        where: {
                            careerId_skillId: {
                                careerId: career.id,
                                skillId: skills[skillName]
                            }
                        },
                        update: {},
                        create: {
                            careerId: career.id,
                            skillId: skills[skillName]
                        }
                    });
                    careerLinked++;
                } catch (e) {
                    // Ignore duplicate errors
                }
            }
        }
    }
    console.log(`   ✅ ${careerLinked} Career-Skill links created`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('\n✨ Skill Seeding Complete!');
    console.log('   - Skills table populated');
    console.log('   - CourseSkill links created (courses → skills they teach)');
    console.log('   - CareerSkill links created (careers → required skills)');
    console.log('\n💡 Now when students complete courses, they will gain skills!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
