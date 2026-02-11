
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

    console.log('--- User Info ---');
    console.log('ID:', divy.id);
    console.log('Education Level:', divy.educationLevel);

    const notifications = await prisma.notification.findMany({
        where: { userId: divy.id },
        orderBy: { createdAt: 'desc' }
    });

    console.log('\n--- Notifications List ---');
    console.log('Total:', notifications.length);
    console.log('Unread:', notifications.filter(n => !n.isRead).length);
    notifications.forEach(n => {
        console.log(`ID: ${n.id} | Read: ${n.isRead} | Title: ${n.title}`);
    });

    const courses = await prisma.course.findMany();
    console.log('\n--- All Courses (Total: ' + courses.length + ') ---');
    courses.slice(0, 10).forEach(c => {
        console.log(`- ${c.title} | Published: ${c.isPublished} | Level: ${c.targetEducationLevel}`);
    });

    const enrollments = await prisma.enrollment.findMany({ where: { userId: divy.id } });
    console.log('\n--- Enrollments for User ---');
    console.log('Count:', enrollments.length);
}

checkData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
