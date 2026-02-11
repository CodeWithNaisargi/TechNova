
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestNotify() {
    const divy = await prisma.user.findFirst({
        where: { name: { contains: 'Divy' } }
    });

    if (!divy) {
        console.log('Divy not found');
        return;
    }

    await prisma.notification.create({
        data: {
            userId: divy.id,
            title: 'Welcome to SkillOrbit!',
            message: 'Discover new courses tailored for your career path.',
            type: 'SYSTEM',
            isRead: false
        }
    });

    console.log('Test notification created for:', divy.name);
}

createTestNotify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
