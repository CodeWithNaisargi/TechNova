import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register({ name, email, password, role });

            // Fetch user data to determine role-based redirect (auto-login after registration)
            const userResponse = await api.get('/auth/me');
            const userData = userResponse.data.data;

            toast({ title: "Success", description: "Account created successfully!" });

            // Redirect based on role
            if (userData.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (userData.role === 'INSTRUCTOR') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Registration failed"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Get started with our LMS platform.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="role">I am a...</Label>
                                <Select onValueChange={setRole} defaultValue={role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT">Student</SelectItem>
                                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Register;
