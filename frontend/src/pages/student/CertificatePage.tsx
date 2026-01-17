import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Download, Share2, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CertificatePage = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch user's certificates
    const { data: certificates, isLoading } = useQuery({
        queryKey: ['certificates', 'my'],
        queryFn: async () => {
            const res = await api.get('/certificates/my-certificates');
            return res.data.data;
        },
    });

    // Fetch enrolled courses
    const { data: enrollments } = useQuery({
        queryKey: ['enrollments', 'my'],
        queryFn: async () => {
            const res = await api.get('/student/enrollments');
            return res.data.data;
        },
    });

    // Generate certificate mutation
    const generateMutation = useMutation({
        mutationFn: async (courseId: string) => {
            const res = await api.post(`/certificates/generate/${courseId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
            toast({
                title: 'Success!',
                description: 'Certificate generated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to generate certificate',
                variant: 'destructive',
            });
        },
    });

    const downloadCertificate = async (certificate: any) => {
        const element = document.getElementById(`certificate-${certificate.id}`);
        if (!element) return;

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
            pdf.save(`Certificate-${certificate.certificateId}.pdf`);

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
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading certificates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">My Certificates</h1>
                                <p className="text-slate-600">
                                    View and download your earned certificates
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certificates Grid */}
                {certificates && certificates.length > 0 ? (
                    <div className="grid gap-6">
                        {certificates.map((certificate: any, index: number) => (
                            <motion.div
                                key={certificate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden border-2 border-slate-100 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Certified
                                                    </Badge>
                                                    <Badge variant="outline">{certificate.completionPercentage}% Complete</Badge>
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                                                    {certificate.courseName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Certificate ID: {certificate.certificateId}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground mb-1">Issued on</p>
                                                <p className="font-semibold">
                                                    {format(new Date(certificate.issueDate), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6">
                                        {/* Certificate Preview */}
                                        <div
                                            id={`certificate-${certificate.id}`}
                                            className="bg-gradient-to-br from-white to-slate-50 border-4 border-primary/20 rounded-lg p-12 mb-6 relative overflow-hidden"
                                        >
                                            {/* Decorative Elements */}
                                            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full translate-x-1/2 translate-y-1/2" />

                                            <div className="relative text-center">
                                                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                                                <h2 className="text-4xl font-bold text-slate-900 mb-2">
                                                    Certificate of Completion
                                                </h2>
                                                <p className="text-lg text-slate-600 mb-8">
                                                    This is to certify that
                                                </p>
                                                <h3 className="text-3xl font-bold text-primary mb-8">
                                                    {certificate.studentName}
                                                </h3>
                                                <p className="text-lg text-slate-600 mb-4">
                                                    has successfully completed the course
                                                </p>
                                                <h4 className="text-2xl font-bold text-slate-900 mb-8">
                                                    {certificate.courseName}
                                                </h4>
                                                <div className="flex items-center justify-center gap-12 text-sm text-slate-600">
                                                    <div>
                                                        <p className="font-semibold mb-1">Issue Date</p>
                                                        <p>{format(new Date(certificate.issueDate), 'MMMM dd, yyyy')}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-1">Certificate ID</p>
                                                        <p className="font-mono">{certificate.certificateId}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => downloadCertificate(certificate)}
                                                className="flex-1"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download PDF
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Share
                                            </Button>
                                            <Button variant="outline">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Verify
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-slate-100"
                    >
                        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No Certificates Yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Complete courses to earn certificates
                        </p>
                    </motion.div>
                )}

                {/* Available Courses */}
                {enrollments && enrollments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <h2 className="text-2xl font-bold mb-4">Generate Certificate</h2>
                        <div className="grid gap-4">
                            {enrollments.map((enrollment: any) => {
                                const hasCertificate = certificates?.some(
                                    (cert: any) => cert.courseId === enrollment.course.id
                                );

                                if (hasCertificate) return null;

                                return (
                                    <Card key={enrollment.id} className="border-2 border-slate-100">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-lg">{enrollment.course.title}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Complete 100% of the course to generate certificate
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => generateMutation.mutate(enrollment.course.id)}
                                                    disabled={generateMutation.isPending}
                                                >
                                                    {generateMutation.isPending ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Award className="w-4 h-4 mr-2" />
                                                            Generate
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CertificatePage;
