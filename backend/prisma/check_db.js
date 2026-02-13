const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.course.count();
        console.log(`Total courses: ${count}`);

        const svgCount = await prisma.course.count({
            where: {
                thumbnail: {
                    endsWith: '.svg'
                }
            }
        });
        console.log(`Courses with SVG thumbnails: ${svgCount}`);

        const jpgCount = await prisma.course.count({
            where: {
                thumbnail: {
                    endsWith: '.jpg'
                }
            }
        });
        console.log(`Courses with JPG thumbnails: ${jpgCount}`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
