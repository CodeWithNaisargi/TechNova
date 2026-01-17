import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Career Paths...');

    // Create Skills (matching by name to avoid duplicates)
    const skills = await Promise.all([
        // Tech Skills
        prisma.skill.upsert({
            where: { name: 'HTML5' },
            update: {},
            create: { name: 'HTML5', description: 'Hypertext Markup Language for web pages' }
        }),
        prisma.skill.upsert({
            where: { name: 'CSS3' },
            update: {},
            create: { name: 'CSS3', description: 'Cascading Style Sheets for styling' }
        }),
        prisma.skill.upsert({
            where: { name: 'JavaScript' },
            update: {},
            create: { name: 'JavaScript', description: 'Programming language for web development' }
        }),
        prisma.skill.upsert({
            where: { name: 'React' },
            update: {},
            create: { name: 'React', description: 'JavaScript library for building UIs' }
        }),
        prisma.skill.upsert({
            where: { name: 'TypeScript' },
            update: {},
            create: { name: 'TypeScript', description: 'Typed superset of JavaScript' }
        }),
        // Healthcare Skills
        prisma.skill.upsert({
            where: { name: 'Python' },
            update: {},
            create: { name: 'Python', description: 'Programming language for data analysis' }
        }),
        prisma.skill.upsert({
            where: { name: 'SQL' },
            update: {},
            create: { name: 'SQL', description: 'Database query language' }
        }),
        prisma.skill.upsert({
            where: { name: 'Tableau' },
            update: {},
            create: { name: 'Tableau', description: 'Data visualization tool' }
        }),
        prisma.skill.upsert({
            where: { name: 'Statistics' },
            update: {},
            create: { name: 'Statistics', description: 'Statistical analysis methods' }
        }),
        // Urban Planning Skills
        prisma.skill.upsert({
            where: { name: 'GIS' },
            update: {},
            create: { name: 'GIS', description: 'Geographic Information Systems' }
        }),
        prisma.skill.upsert({
            where: { name: 'Urban Design' },
            update: {},
            create: { name: 'Urban Design', description: 'City planning and design principles' }
        }),
        prisma.skill.upsert({
            where: { name: 'IoT' },
            update: {},
            create: { name: 'IoT', description: 'Internet of Things technologies' }
        }),
        prisma.skill.upsert({
            where: { name: 'Sustainability' },
            update: {},
            create: { name: 'Sustainability', description: 'Sustainable development practices' }
        }),
    ]);

    console.log('✅ Skills created');

    // Create Career Paths
    const frontendDev = await prisma.careerPath.upsert({
        where: { id: 'career-frontend' },
        update: {},
        create: {
            id: 'career-frontend',
            title: 'Frontend Developer',
            description: 'Build beautiful, responsive, and interactive user interfaces for web applications using modern frameworks and technologies.',
            domain: 'TECH',
        }
    });

    const healthcareAnalyst = await prisma.careerPath.upsert({
        where: { id: 'career-healthcare' },
        update: {},
        create: {
            id: 'career-healthcare',
            title: 'Healthcare Data Analyst',
            description: 'Analyze healthcare data to improve patient outcomes, optimize operations, and drive evidence-based decisions in medical facilities.',
            domain: 'HEALTHCARE',
        }
    });

    const smartCityPlanner = await prisma.careerPath.upsert({
        where: { id: 'career-urban' },
        update: {},
        create: {
            id: 'career-urban',
            title: 'Smart City Planner',
            description: 'Design and implement smart city solutions integrating technology, sustainability, and urban planning for future cities.',
            domain: 'URBAN',
        }
    });

    console.log('✅ Career Paths created');

    // Map Skills to Careers (using skill names to find IDs)
    const skillNameMappings: Record<string, string[]> = {
        'career-frontend': ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript'],
        'career-healthcare': ['Python', 'SQL', 'Tableau', 'Statistics'],
        'career-urban': ['GIS', 'Urban Design', 'IoT', 'Sustainability', 'Python'],
    };

    for (const [careerId, skillNames] of Object.entries(skillNameMappings)) {
        for (const skillName of skillNames) {
            const skill = await prisma.skill.findUnique({ where: { name: skillName } });
            if (skill) {
                try {
                    await prisma.careerSkill.upsert({
                        where: {
                            careerId_skillId: { careerId, skillId: skill.id }
                        },
                        update: {},
                        create: { careerId, skillId: skill.id },
                    });
                } catch (e) {
                    // Skip if skill not found
                }
            }
        }
    }

    console.log('✅ Career-Skill mappings created');
    console.log('🎉 Career Paths seed completed!');
    console.log('\n📊 Summary:');
    console.log('- 3 Career Paths: Frontend Developer, Healthcare Data Analyst, Smart City Planner');
    console.log('- Skills mapped across careers');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
