
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const users = await prisma.user.findMany({
        take: 10,
        select: { id: true, email: true, name: true, educationLevel: true }
    });

    console.log('--- Users ---');
    console.log(JSON.stringify(users, null, 2));

    if (users.length === 0) {
        console.log('No users found');
        return;
    }

    // Try to find Divy Pattani
    const divy = users.find(u => u.name.includes('Divy')) || users[0];
    console.log('\n--- Selected User (Divy or first):', divy.name, '---');

    const notificationCount = await prisma.notification.count({ where: { userId: divy.id } });
    const unreadCount = await prisma.notification.count({ where: { userId: divy.id, isRead: false } });
    const notifications = await prisma.notification.findMany({ where: { userId: divy.id } });

    console.log('Total Notifications:', notificationCount);
    console.log('Unread Count:', unreadCount);
    console.log('Notifications (first 5):', JSON.stringify(notifications.slice(0, 5), null, 2));

    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        take: 5,
        select: { id: true, title: true, targetEducationLevel: true, domain: true }
    });
    console.log('\n--- Published Courses ---');
    console.log(JSON.stringify(courses, null, 2));
}

checkData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
