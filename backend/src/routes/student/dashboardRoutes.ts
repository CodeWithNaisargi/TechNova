import { Router } from "express";
import prisma from "../../config/prisma";
import { protect } from "../../middleware/auth";

const router = Router();

// GET /api/student/dashboard
router.get("/dashboard", protect, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Total enrolled courses
    const totalEnrolledCourses = await prisma.enrollment.count({
      where: { userId }
    });

    // Completed assignments
    const completedAssignments = await prisma.submission.count({
      where: {
        studentId: userId,
        status: "APPROVED"
      }
    });

    // Pending assignments
    const pendingAssignments = await prisma.submission.count({
      where: {
        studentId: userId,
        status: "PENDING"
      }
    });

    // Certificates (courses with all assignments approved)
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true }
    });
    let certificates = 0;
    for (const { courseId } of enrollments) {
      const assignments = await prisma.assignment.findMany({
        where: { courseId },
        select: { id: true }
      });
      if (assignments.length === 0) continue;
      const approved = await prisma.submission.count({
        where: {
          studentId: userId,
          assignmentId: { in: assignments.map(a => a.id) },
          status: "APPROVED"
        }
      });
      if (approved === assignments.length) {
        certificates++;
      }
    }

    return res.json({
      totalEnrolledCourses: totalEnrolledCourses ?? 0,
      completedAssignments: completedAssignments ?? 0,
      pendingAssignments: pendingAssignments ?? 0,
      certificates: certificates ?? 0
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
