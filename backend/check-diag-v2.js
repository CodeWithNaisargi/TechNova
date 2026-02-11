
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const divy = await prisma.user.findFirst({
        where: { name: { contains: 'Divy' } },
        include: { interestedCareerPath: true }
    });

    if (!divy) {
        console.log('Divy Pattani not found');
        return;
    }

    console.log('--- User Profile ---');
    console.log('ID:', divy.id);
    console.log('Education Level:', divy.educationLevel);
    console.log('Domain:', divy.interestedCareerPath?.domain);

    const notifications = await prisma.notification.findMany({
        where: { userId: divy.id },
        orderBy: { createdAt: 'desc' }
    });

    console.log('\n--- Notifications ---');
    console.log('Total:', notifications.length);
    console.log('Unread:', notifications.filter(n => !n.isRead).length);
    notifications.forEach(n => {
        console.log(`- [${n.isRead ? 'READ' : 'UNREAD'}] ${n.title}: ${n.message.substring(0, 30)}...`);
    });

    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        select: { title: true, targetEducationLevel: true, domain: true }
    });

    console.log('\n--- Published Courses Summary ---');
    console.log('Total Published:', courses.length);
    const levels = [...new Set(courses.map(c => c.targetEducationLevel))];
    const domains = [...new Set(courses.map(c => c.domain))];
    console.log('Levels available:', levels);
    console.log('Domains available:', domains);
}

checkData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
