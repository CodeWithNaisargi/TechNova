import { PrismaClient } from '@prisma/client';

declare const process: any;

const prisma = new PrismaClient();

/**
 * Backfill Skills for Existing Certificates
 */

async function main() {
    console.log('🔧 Backfilling Skills for Existing Certificates...\n');

    // Get all certificates
    const certificates = await prisma.certificate.findMany({
        select: { id: true, userId: true, courseId: true }
    });

    console.log(`📜 Found ${certificates.length} certificates to process\n`);

    let skillsAdded = 0;

    for (const cert of certificates) {
        // Get course with its skills
        const course = await prisma.course.findUnique({
            where: { id: cert.courseId },
            include: {
                courseSkills: { include: { skill: true } }
            }
        });

        if (!course) {
            console.log(`⚠️ Course not found for certificate ${cert.id}`);
            continue;
        }

        console.log(`📚 Processing: "${course.title}"`);

        const courseSkills = course.courseSkills;
        if (courseSkills.length === 0) {
            console.log(`   ℹ️ No skills linked to this course`);
            continue;
        }

        // Add skills for this user
        for (const cs of courseSkills) {
            try {
                await prisma.userSkill.upsert({
                    where: {
                        userId_skillId: { userId: cert.userId, skillId: cs.skillId }
                    },
                    update: {
                        level: { increment: 20 }
                    },
                    create: {
                        userId: cert.userId,
                        skillId: cs.skillId,
                        level: 30,
                        source: 'COURSE_COMPLETION'
                    }
                });
                skillsAdded++;
                console.log(`   ✅ Added: ${cs.skill.name}`);
            } catch (e: any) {
                console.log(`   ⚠️ Error: ${e.message}`);
            }
        }
    }

    console.log(`\n✨ Backfill Complete!`);
    console.log(`   Skills added/updated: ${skillsAdded}`);

    // Show user skills count
    const userSkillCount = await prisma.userSkill.count();
    console.log(`   Total UserSkill records: ${userSkillCount}`);
}

main()
    .catch((e) => {
        console.error('❌ Backfill failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
