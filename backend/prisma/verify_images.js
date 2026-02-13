const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(__dirname, '../../frontend/public');

async function check() {
    try {
        const courses = await prisma.course.findMany({
            select: {
                title: true,
                thumbnail: true
            }
        });

        console.log(`Checking ${courses.length} courses...`);
        let missingCount = 0;
        let svgCount = 0;
        let jpgCount = 0;
        let otherCount = 0;

        for (const course of courses) {
            const thumbnailPath = course.thumbnail;
            if (!thumbnailPath) {
                console.log(`[MISSING FIELD] ${course.title}: No thumbnail field`);
                missingCount++;
                continue;
            }

            const absolutePath = path.join(PUBLIC_DIR, thumbnailPath);
            const exists = fs.existsSync(absolutePath);

            if (thumbnailPath.endsWith('.svg')) svgCount++;
            else if (thumbnailPath.endsWith('.jpg') || thumbnailPath.endsWith('.jpeg')) jpgCount++;
            else otherCount++;

            if (!exists) {
                console.log(`[FILE MISSING] ${course.title}: ${thumbnailPath}`);
                missingCount++;
            }
        }

        console.log('\n' + '='.repeat(40));
        console.log(`Total Courses: ${courses.length}`);
        console.log(`Courses with missing images: ${missingCount}`);
        console.log(`SVG thumbnails: ${svgCount}`);
        // Note: these counts are from DB paths, not file existence
        console.log(`JPG thumbnails: ${jpgCount}`);
        console.log('='.repeat(40));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
