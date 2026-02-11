import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Certificate {
    id: string;
    certificateId: string;
    courseName: string;
    studentName: string;
    instructorName?: string;
    issueDate: string;
    completionPercentage: number;
    pdfUrl?: string;
}

interface CertificateSectionProps {
    certificate: Certificate;
}

const CertificateSection = ({ certificate }: CertificateSectionProps) => {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadCertificate = async () => {
        setIsDownloading(true);
        const element = document.getElementById('certificate-preview');
        if (!element) {
            setIsDownloading(false);
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`SkillOrbit_Certificate_${certificate.certificateId}.pdf`);

            toast({
                title: 'Success!',
                description: 'Certificate downloaded successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to download certificate',
                variant: 'destructive',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mx-auto max-w-4xl"
        >
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">🎓 Course Completed Successfully!</h2>
                        <p className="text-white/80">
                            Congratulations! You have earned your certificate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Certificate Preview */}
            <div className="bg-white border-2 border-t-0 border-slate-200 rounded-b-xl p-6">
                <div
                    id="certificate-preview"
                    className="bg-gradient-to-br from-white to-blue-50 border-4 border-blue-200 rounded-lg p-10 relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full translate-x-1/2 translate-y-1/2" />

                    <div className="relative text-center">
                        {/* SkillOrbit Branding */}
                        <p className="text-slate-500 text-sm mb-2">SkillOrbit</p>

                        <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />

                        <h3 className="text-3xl font-bold text-slate-900 mb-1">
                            Certificate of Completion
                        </h3>

                        <p className="text-slate-600 mb-6">This is to certify that</p>

                        <h4 className="text-2xl font-bold text-blue-600 mb-6">
                            {certificate.studentName}
                        </h4>

                        <p className="text-slate-600 mb-3">has successfully completed the course</p>

                        <h5 className="text-xl font-bold text-slate-900 mb-4">
                            {certificate.courseName}
                        </h5>

                        {certificate.instructorName && (
                            <p className="text-sm text-slate-500 mb-6">
                                Instructor: {certificate.instructorName}
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-10 text-sm text-slate-600 mt-6">
                            <div>
                                <p className="font-semibold">Issue Date</p>
                                <p>{format(new Date(certificate.issueDate), 'MMMM dd, yyyy')}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Certificate ID</p>
                                <p className="font-mono text-xs">{certificate.certificateId}</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 mt-6">
                            Issued by SkillOrbit Learning Platform
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={downloadCertificate}
                        disabled={isDownloading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {isDownloading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </>
                        )}
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                        <a href="/certificates">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View All Certificates
                        </a>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default CertificateSection;
