"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssignmentProgress = exports.getAssignmentProgress = exports.deleteAssignment = exports.updateAssignment = exports.createAssignment = exports.getAssignmentById = exports.getCourseAssignments = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Get all assignments for a course
const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await prisma_1.default.assignment.findMany({
            where: { courseId },
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });
        res.json({
            success: true,
            data: assignments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignments',
        });
    }
};
exports.getCourseAssignments = getCourseAssignments;
// Get single assignment by ID
const getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await prisma_1.default.assignment.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    }
                },
                _count: {
                    select: { submissions: true }
                }
            }
        });
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found',
            });
        }
        res.json({
            success: true,
            data: assignment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch assignment',
        });
    }
};
exports.getAssignmentById = getAssignmentById;
// Create assignment (Admin/Instructor)
const createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, content, order, attachmentUrl, videoUrl, dueDate } = req.body;
        // Verify course exists
        const course = await prisma_1.default.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }
        const assignment = await prisma_1.default.assignment.create({
            data: {
                courseId,
                title,
                description,
                content,
                order: order || 0,
                attachmentUrl,
                videoUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });
        res.status(201).json({
            success: true,
            data: assignment,
            message: 'Assignment created successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create assignment',
        });
    }
};
exports.createAssignment = createAssignment;
// Update assignment (Admin/Instructor)
const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, order, attachmentUrl, videoUrl, dueDate } = req.body;
        const assignment = await prisma_1.default.assignment.update({
            where: { id },
            data: {
                title,
                description,
                content,
                order,
                attachmentUrl,
                videoUrl,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });
        res.json({
            success: true,
            data: assignment,
            message: 'Assignment updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update assignment',
        });
    }
};
exports.updateAssignment = updateAssignment;
// Delete assignment (Admin/Instructor)
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.assignment.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete assignment',
        });
    }
};
exports.deleteAssignment = deleteAssignment;
// Get student's assignment progress
const getAssignmentProgress = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        let progress = await prisma_1.default.assignmentProgress.findUnique({
            where: {
                userId_assignmentId: {
                    userId,
                    assignmentId,
                }
            }
        });
        // Create progress if doesn't exist
        if (!progress) {
            progress = await prisma_1.default.assignmentProgress.create({
                data: {
                    userId,
                    assignmentId,
                    status: 'NOT_STARTED',
                }
            });
        }
        res.json({
            success: true,
            data: progress,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch progress',
        });
    }
};
exports.getAssignmentProgress = getAssignmentProgress;
// Update assignment progress
const updateAssignmentProgress = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        const progress = await prisma_1.default.assignmentProgress.upsert({
            where: {
                userId_assignmentId: {
                    userId,
                    assignmentId,
                }
            },
            update: {
                status,
                startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' || status === 'SUBMITTED' ? new Date() : undefined,
            },
            create: {
                userId,
                assignmentId,
                status,
                startedAt: status === 'IN_PROGRESS' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' || status === 'SUBMITTED' ? new Date() : undefined,
            }
        });
        res.json({
            success: true,
            data: progress,
            message: 'Progress updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update progress',
        });
    }
};
exports.updateAssignmentProgress = updateAssignmentProgress;
