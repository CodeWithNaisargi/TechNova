
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setPath() {
    const divy = await prisma.user.findFirst({
        where: { name: { contains: 'Divy' } }
    });

    if (!divy) {
        console.log('Divy not found');
        return;
    }

    const paths = await prisma.careerPath.findMany();
    if (paths.length === 0) {
        console.log('No career paths found');
        return;
    }

    const targetPath = paths.find(p => p.domain === 'TECH') || paths[0];

    await prisma.user.update({
        where: { id: divy.id },
        data: { interestedCareerPathId: targetPath.id }
    });

    console.log(`User ${divy.name} now has career path: ${targetPath.title} (${targetPath.domain})`);
}

setPath()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
