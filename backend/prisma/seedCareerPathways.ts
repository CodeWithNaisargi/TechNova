
import { PrismaClient, EducationLevel } from '@prisma/client';

const prisma = new PrismaClient();

const CAREER_PATHWAYS = [
    {
        education: EducationLevel.SECONDARY, // 10th
        domains: [
            {
                name: 'Career Exploration',
                description: 'Discover your potential with foundational skills.',
                roles: [
                    {
                        title: 'Technical Apprentice',
                        description: 'Learn basics of technical systems and maintenance.',
                        difficulty: 'BEGINNER',
                        salaryMin: 120000,
                        salaryMax: 180000,
                        demand: 'High',
                        skills: ['Basic Computer Skills', 'Safety Procedures', 'Tool Usage']
                    },
                    {
                        title: 'IT Support Assistant',
                        description: 'Assist with basic hardware and software issues.',
                        difficulty: 'BEGINNER',
                        salaryMin: 150000,
                        salaryMax: 220000,
                        demand: 'Moderate',
                        skills: ['Computer Hardware', 'Troubleshooting', 'Communication']
                    }
                ]
            }
        ]
    },
    {
        education: EducationLevel.HIGHER_SECONDARY, // 12th
        domains: [
            {
                name: 'Engineering & Technology',
                description: 'Foundations for future engineers and tech professionals.',
                roles: [
                    {
                        title: 'Junior Developer',
                        description: 'Start your coding journey with web basics.',
                        difficulty: 'INTERMEDIATE',
                        salaryMin: 300000,
                        salaryMax: 500000,
                        demand: 'High',
                        skills: ['HTML/CSS', 'JavaScript Basics', 'Git']
                    },
                    {
                        title: 'Data Entry Analyst',
                        description: 'Manage and process data efficiently.',
                        difficulty: 'BEGINNER',
                        salaryMin: 250000,
                        salaryMax: 400000,
                        demand: 'Moderate',
                        skills: ['Excel', 'Data Accuracy', 'Typing']
                    }
                ]
            }
        ]
    },
    {
        education: EducationLevel.UNDERGRADUATE,
        domains: [
            {
                name: 'Professional Engineering',
                description: 'Advanced roles for engineering graduates.',
                roles: [
                    {
                        title: 'Frontend Developer',
                        description: 'Build modern, responsive web applications.',
                        difficulty: 'ADVANCED',
                        salaryMin: 600000,
                        salaryMax: 1200000,
                        demand: 'High',
                        skills: ['React', 'TypeScript', 'Tailwind CSS', 'State Management']
                    },
                    {
                        title: 'Backend Engineer',
                        description: 'Architect scalable server-side systems.',
                        difficulty: 'ADVANCED',
                        salaryMin: 700000,
                        salaryMax: 1500000,
                        demand: 'High',
                        skills: ['Node.js', 'PostgreSQL', 'System Design', 'API Development']
                    }
                ]
            }
        ]
    },
    {
        education: EducationLevel.DIPLOMA,
        domains: [
            {
                name: 'Vocational & Technical',
                description: 'Practical skills for specialized technical roles.',
                roles: [
                    {
                        title: 'Junior Site Engineer',
                        description: 'Supervise construction and maintenance sites.',
                        difficulty: 'INTERMEDIATE',
                        salaryMin: 200000,
                        salaryMax: 350000,
                        demand: 'Moderate',
                        skills: ['Site Safety', 'Blueprint Reading', 'Team Supervision']
                    },
                    {
                        title: 'Graphic Designer',
                        description: 'Create visual content for print and digital media.',
                        difficulty: 'INTERMEDIATE',
                        salaryMin: 250000,
                        salaryMax: 450000,
                        demand: 'High',
                        skills: ['Photoshop', 'Illustrator', 'Visual Design']
                    }
                ]
            }
        ]
    }
];

async function main() {
    console.log('🌱 Seeding Career Pathways...');

    // 1. Clean existing mappings
    await prisma.educationCareerMapping.deleteMany({});
    // Note: We are NOT deleting roles/domains to preserve existing data, 
    // but in a real reset, we might want to. customizable.

    // 2. Iterate and Seed
    for (const path of CAREER_PATHWAYS) {
        console.log(`\nProcessing Education Level: ${path.education}`);

        for (const domainData of path.domains) {
            // Upsert Domain
            const domain = await prisma.domain.upsert({
                where: { name: domainData.name },
                update: {},
                create: {
                    name: domainData.name,
                    description: domainData.description,
                    icon: 'Briefcase'
                }
            });

            // Create Mapping
            await prisma.educationCareerMapping.create({
                data: {
                    educationLevel: path.education,
                    domainId: domain.id
                }
            });

            // Upsert Roles
            for (const roleData of domainData.roles) {
                const role = await prisma.careerRole.upsert({
                    where: {
                        // Assuming title + domain is unique enough for seeding, 
                        // but Prisma schema only has ID unique. 
                        // We'll find first to update or create.
                        id: 'unavailable-id' // Hack: Upsert requires unique where. 
                        // Real logic: findFirst -> update OR create.
                    },
                    update: {},
                    create: {
                        title: roleData.title,
                        description: roleData.description,
                        domainId: domain.id,
                        difficultyLevel: roleData.difficulty,
                        minEducation: path.education,
                        salaryMin: roleData.salaryMin,
                        salaryMax: roleData.salaryMax,
                        demand: roleData.demand,
                        estimatedDuration: '6 Months'
                    }
                }).catch(async () => {
                    // Fallback for create if ID not found (which is always true above)
                    // But we want to avoid duplicates.
                    const existing = await prisma.careerRole.findFirst({
                        where: { title: roleData.title, domainId: domain.id }
                    });

                    if (existing) {
                        return prisma.careerRole.update({
                            where: { id: existing.id },
                            data: {
                                minEducation: path.education,
                                salaryMin: roleData.salaryMin,
                                salaryMax: roleData.salaryMax,
                                demand: roleData.demand
                            }
                        });
                    }

                    return prisma.careerRole.create({
                        data: {
                            title: roleData.title,
                            description: roleData.description,
                            domainId: domain.id,
                            difficultyLevel: roleData.difficulty,
                            minEducation: path.education,
                            salaryMin: roleData.salaryMin,
                            salaryMax: roleData.salaryMax,
                            demand: roleData.demand,
                            estimatedDuration: '6 Months'
                        }
                    });
                });

                console.log(`   - Processed Role: ${role.title}`);

                // Map Skills (Basic implementation)
                for (const [index, skillName] of roleData.skills.entries()) {
                    const skill = await prisma.skill.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName }
                    });

                    await prisma.roleSkill.upsert({
                        where: {
                            roleId_skillId: {
                                roleId: role.id,
                                skillId: skill.id
                            }
                        },
                        update: {},
                        create: {
                            roleId: role.id,
                            skillId: skill.id,
                            orderIndex: index
                        }
                    });
                }
            }
        }
    }

    console.log('✅ Career Pathways Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
