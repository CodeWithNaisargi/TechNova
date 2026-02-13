"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateCertificatePDF = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            // Ensure certificates directory exists
            const certsDir = path_1.default.join(process.cwd(), 'uploads', 'certificates');
            if (!fs_1.default.existsSync(certsDir)) {
                fs_1.default.mkdirSync(certsDir, { recursive: true });
            }
            const filename = `${data.certificateId}.pdf`;
            const filepath = path_1.default.join(certsDir, filename);
            // Create PDF document
            const doc = new pdfkit_1.default({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });
            // Pipe to file
            const stream = fs_1.default.createWriteStream(filepath);
            doc.pipe(stream);
            // Certificate Design
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            // Border
            doc.lineWidth(10)
                .strokeColor('#1e40af')
                .rect(20, 20, pageWidth - 40, pageHeight - 40)
                .stroke();
            doc.lineWidth(3)
                .strokeColor('#3b82f6')
                .rect(30, 30, pageWidth - 60, pageHeight - 60)
                .stroke();
            // Title
            doc.fontSize(48)
                .fillColor('#1e40af')
                .font('Helvetica-Bold')
                .text('CERTIFICATE', 0, 100, {
                align: 'center',
                width: pageWidth
            });
            doc.fontSize(24)
                .fillColor('#6b7280')
                .font('Helvetica')
                .text('OF COMPLETION', 0, 160, {
                align: 'center',
                width: pageWidth
            });
            // Decorative line
            doc.moveTo(pageWidth / 2 - 150, 200)
                .lineTo(pageWidth / 2 + 150, 200)
                .strokeColor('#3b82f6')
                .lineWidth(2)
                .stroke();
            // Student Name
            doc.fontSize(16)
                .fillColor('#374151')
                .font('Helvetica')
                .text('This is to certify that', 0, 240, {
                align: 'center',
                width: pageWidth
            });
            doc.fontSize(36)
                .fillColor('#1e40af')
                .font('Helvetica-Bold')
                .text(data.studentName, 0, 280, {
                align: 'center',
                width: pageWidth
            });
            // Course Name
            doc.fontSize(16)
                .fillColor('#374151')
                .font('Helvetica')
                .text('has successfully completed the course', 0, 340, {
                align: 'center',
                width: pageWidth
            });
            doc.fontSize(28)
                .fillColor('#1e40af')
                .font('Helvetica-Bold')
                .text(data.courseName, 0, 375, {
                align: 'center',
                width: pageWidth
            });
            // Completion Info
            doc.fontSize(14)
                .fillColor('#6b7280')
                .font('Helvetica')
                .text(`with ${data.completionPercentage}% completion`, 0, 430, {
                align: 'center',
                width: pageWidth
            });
            // Date and Certificate ID
            const formattedDate = new Date(data.issueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.fontSize(12)
                .fillColor('#374151')
                .font('Helvetica')
                .text(`Issue Date: ${formattedDate}`, 100, pageHeight - 100, {
                align: 'left'
            });
            doc.fontSize(12)
                .fillColor('#374151')
                .font('Helvetica')
                .text(`Certificate ID: ${data.certificateId}`, pageWidth - 300, pageHeight - 100, {
                align: 'right',
                width: 200
            });
            // LMS Branding
            doc.fontSize(20)
                .fillColor('#1e40af')
                .font('Helvetica-Bold')
                .text('LMS Platform', 0, pageHeight - 140, {
                align: 'center',
                width: pageWidth
            });
            // Finalize PDF
            doc.end();
            stream.on('finish', () => {
                // Return relative URL path
                const pdfUrl = `/uploads/certificates/${filename}`;
                resolve(pdfUrl);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateCertificatePDF = generateCertificatePDF;
