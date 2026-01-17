import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Career Paths...');

    // Create Skills
    const skills = await Promise.all([
        // Tech Skills
        prisma.skill.upsert({
            where: { id: 'skill-html' },
            update: {},
            create: { id: 'skill-html', name: 'HTML5', description: 'Hypertext Markup Language for web pages' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-css' },
            update: {},
            create: { id: 'skill-css', name: 'CSS3', description: 'Cascading Style Sheets for styling' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-js' },
            update: {},
            create: { id: 'skill-js', name: 'JavaScript', description: 'Programming language for web development' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-react' },
            update: {},
            create: { id: 'skill-react', name: 'React', description: 'JavaScript library for building UIs' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-ts' },
            update: {},
            create: { id: 'skill-ts', name: 'TypeScript', description: 'Typed superset of JavaScript' }
        }),
        // Healthcare Skills
        prisma.skill.upsert({
            where: { id: 'skill-python' },
            update: {},
            create: { id: 'skill-python', name: 'Python', description: 'Programming language for data analysis' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-sql' },
            update: {},
            create: { id: 'skill-sql', name: 'SQL', description: 'Database query language' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-tableau' },
            update: {},
            create: { id: 'skill-tableau', name: 'Tableau', description: 'Data visualization tool' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-stats' },
            update: {},
            create: { id: 'skill-stats', name: 'Statistics', description: 'Statistical analysis methods' }
        }),
        // Urban Planning Skills
        prisma.skill.upsert({
            where: { id: 'skill-gis' },
            update: {},
            create: { id: 'skill-gis', name: 'GIS', description: 'Geographic Information Systems' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-urban' },
            update: {},
            create: { id: 'skill-urban', name: 'Urban Design', description: 'City planning and design principles' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-iot' },
            update: {},
            create: { id: 'skill-iot', name: 'IoT', description: 'Internet of Things technologies' }
        }),
        prisma.skill.upsert({
            where: { id: 'skill-sustainability' },
            update: {},
            create: { id: 'skill-sustainability', name: 'Sustainability', description: 'Sustainable development practices' }
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

    // Map Skills to Careers
    const careerSkillMappings = [
        // Frontend Developer Skills
        { careerId: 'career-frontend', skillId: 'skill-html' },
        { careerId: 'career-frontend', skillId: 'skill-css' },
        { careerId: 'career-frontend', skillId: 'skill-js' },
        { careerId: 'career-frontend', skillId: 'skill-react' },
        { careerId: 'career-frontend', skillId: 'skill-ts' },
        // Healthcare Data Analyst Skills
        { careerId: 'career-healthcare', skillId: 'skill-python' },
        { careerId: 'career-healthcare', skillId: 'skill-sql' },
        { careerId: 'career-healthcare', skillId: 'skill-tableau' },
        { careerId: 'career-healthcare', skillId: 'skill-stats' },
        // Smart City Planner Skills
        { careerId: 'career-urban', skillId: 'skill-gis' },
        { careerId: 'career-urban', skillId: 'skill-urban' },
        { careerId: 'career-urban', skillId: 'skill-iot' },
        { careerId: 'career-urban', skillId: 'skill-sustainability' },
        { careerId: 'career-urban', skillId: 'skill-python' },
    ];

    for (const mapping of careerSkillMappings) {
        await prisma.careerSkill.upsert({
            where: {
                careerId_skillId: {
                    careerId: mapping.careerId,
                    skillId: mapping.skillId,
                }
            },
            update: {},
            create: mapping,
        });
    }

    console.log('✅ Career-Skill mappings created');
    console.log('🎉 Career Paths seed completed!');
    console.log('\n📊 Summary:');
    console.log('- 3 Career Paths: Frontend Developer, Healthcare Data Analyst, Smart City Planner');
    console.log('- 13 Skills mapped across careers');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
