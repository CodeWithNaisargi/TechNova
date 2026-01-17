import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface CertificateData {
    studentName: string;
    courseName: string;
    certificateId: string;
    issueDate: string;
    completionPercentage: number;
}

/**
 * Generate and download a PDF certificate from an HTML element
 * @param elementId - ID of the HTML element containing the certificate design
 * @param certificateData - Certificate data for filename and metadata
 */
export const generateCertificatePDF = async (
    elementId: string,
    certificateData: CertificateData
): Promise<void> => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with ID "${elementId}" not found`);
        }

        // Show a loading state if needed (optional)
        const originalDisplay = element.style.display;
        element.style.display = 'block';

        // Capture the certificate as canvas with high quality
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Enable CORS for external images
            logging: false, // Disable logging
            backgroundColor: '#ffffff',
            windowWidth: 1920, // Fixed width for consistency
            windowHeight: 1080,
        });

        // Restore original display
        element.style.display = originalDisplay;

        // Convert canvas to image data
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Create PDF in landscape orientation (typical for certificates)
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        // Calculate dimensions to fit the image
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Generate filename
        const filename = `Certificate-${certificateData.certificateId}-${certificateData.studentName.replace(/\s+/g, '-')}.pdf`;

        // Download the PDF
        pdf.save(filename);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate certificate PDF');
    }
};

/**
 * Print the certificate
 */
export const printCertificate = (): void => {
    window.print();
};

/**
 * Share certificate URL (if you have a public URL for certificates)
 */
export const shareCertificate = (certificateId: string): void => {
    const url = `${window.location.origin}/certificates/verify/${certificateId}`;

    if (navigator.share) {
        navigator
            .share({
                title: 'My Certificate',
                text: 'Check out my certificate!',
                url,
            })
            .catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url).then(
            () => {
                alert('Certificate link copied to clipboard!');
            },
            (error) => {
                console.error('Could not copy text: ', error);
            }
        );
    }
};
