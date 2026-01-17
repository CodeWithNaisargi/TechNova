import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

type VerificationState = 'loading' | 'success' | 'error' | 'expired';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<VerificationState>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setState('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                const response = await api.get(`/auth/verify-email?token=${token}`);
                if (response.data.success) {
                    setState('success');
                    setMessage(response.data.message || 'Your email has been verified successfully!');
                } else {
                    setState('error');
                    setMessage(response.data.message || 'Verification failed.');
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Verification failed.';
                if (errorMessage.includes('expired')) {
                    setState('expired');
                } else {
                    setState('error');
                }
                setMessage(errorMessage);
            }
        };

        verifyToken();
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <Card className="w-[450px]">
                <CardHeader className="text-center">
                    {state === 'loading' && (
                        <>
                            <div className="mx-auto mb-4 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <CardTitle>Verifying Email</CardTitle>
                            <CardDescription>Please wait while we verify your email address...</CardDescription>
                        </>
                    )}
                    {state === 'success' && (
                        <>
                            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <CardTitle className="text-green-600">Email Verified!</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </>
                    )}
                    {state === 'error' && (
                        <>
                            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <CardTitle className="text-red-600">Verification Failed</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </>
                    )}
                    {state === 'expired' && (
                        <>
                            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <CardTitle className="text-yellow-600">Link Expired</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </>
                    )}
                </CardHeader>
                <CardContent>
                    {state === 'expired' && (
                        <p className="text-center text-sm text-muted-foreground">
                            Please try logging in to request a new verification email.
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    {state !== 'loading' && (
                        <Link to="/login">
                            <Button>Go to Login</Button>
                        </Link>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default VerifyEmail;
