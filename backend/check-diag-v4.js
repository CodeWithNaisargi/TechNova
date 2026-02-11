
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const divy = await prisma.user.findFirst({
        where: { name: { contains: 'Divy' } }
    });

    if (!divy) {
        console.log('USER_NOT_FOUND');
        return;
    }

    console.log('USER_ID:', divy.id);
    console.log('USER_EDUCATION:', divy.educationLevel);

    const notifications = await prisma.notification.findMany({
        where: { userId: divy.id }
    });

    console.log('NOTIFICATION_COUNT:', notifications.length);
    notifications.forEach(n => {
        console.log(`NOTIFICATION_ITEM: ID=${n.id}, Read=${n.isRead}, Title="${n.title}"`);
    });

    const unreadCount = await prisma.notification.count({
        where: { userId: divy.id, isRead: false }
    });
    console.log('UNREAD_COUNT_REPORTED:', unreadCount);

    const courseCount = await prisma.course.count();
    console.log('TOTAL_COURSES:', courseCount);

    const publishedCourses = await prisma.course.findMany({
        where: { isPublished: true },
        select: { title: true, targetEducationLevel: true }
    });
    console.log('PUBLISHED_COURSES_COUNT:', publishedCourses.length);
    publishedCourses.forEach(c => {
        console.log(`COURSE_ITEM: Title="${c.title}", Level=${c.targetEducationLevel}`);
    });
}

checkData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
