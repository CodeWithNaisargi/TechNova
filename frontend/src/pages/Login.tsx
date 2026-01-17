import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setShowResendVerification(false);

        try {
            await login({ email, password });

            // Fetch user data to determine role-based redirect
            const userResponse = await api.get('/auth/me');
            const userData = userResponse.data.data;

            toast({ title: "Success", description: "Logged in successfully" });

            // Redirect based on role
            if (userData.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (userData.role === 'INSTRUCTOR') {
                navigate('/instructor/dashboard');
            } else {
                // Student onboarding flow: Education → Career Interest → Dashboard
                if (!userData.educationLevel) {
                    navigate('/onboarding/education');
                } else if (!userData.interestedCareerPath) {
                    navigate('/onboarding/career');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error: any) {
            const errorCode = error.response?.data?.code;
            const errorMessage = error.response?.data?.message || "Login failed";

            if (errorCode === 'EMAIL_NOT_VERIFIED') {
                setShowResendVerification(true);
            }

            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            await api.post('/auth/resend-verification', { email });
            toast({
                title: "Email Sent",
                description: "A new verification link has been sent to your email."
            });
            setShowResendVerification(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to resend verification email"
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {showResendVerification && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                    <p className="text-sm text-yellow-800 mb-2">
                                        Your email is not verified yet.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResendVerification}
                                        disabled={isResending}
                                        className="w-full"
                                    >
                                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
