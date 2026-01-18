import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Trash2, Download, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface UserSettings {
    emailNotifications: boolean;
    assignmentNotifications: boolean;
    courseUpdateNotifications: boolean;
    profileVisibility: boolean;
    dataSharing: boolean;
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
}

export default function Settings() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [deletePassword, setDeletePassword] = useState('');
    const { theme, setTheme: setThemeContext } = useTheme();

    // Fetch user settings
    const { data: settings } = useQuery({
        queryKey: ['user-settings'],
        queryFn: async () => {
            const res = await api.get('/users/settings');
            return res.data.data as UserSettings;
        }
    });

    // Sync theme from backend settings to context on mount
    useEffect(() => {
        if (settings?.theme && settings.theme !== theme) {
            setThemeContext(settings.theme);
        }
    }, [settings?.theme]);

    // Profile update mutation
    const profileMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.patch('/users/profile', data);
            return res.data;
        },
        onSuccess: () => {
            toast({ title: 'Profile updated successfully' });
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update profile', variant: 'destructive' });
        }
    });

    // Settings update mutation
    const settingsMutation = useMutation({
        mutationFn: async (data: Partial<UserSettings>) => {
            const res = await api.patch('/users/settings', data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            toast({ title: 'Settings updated successfully' });
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
            // Update theme context immediately if theme was changed
            if (variables.theme) {
                setThemeContext(variables.theme);
            }
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.response?.data?.message || 'Failed to update settings', variant: 'destructive' });
        }
    });

    // Password change mutation
    const passwordMutation = useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
            const res = await api.patch('/users/password', data);
            return res.data;
        },
        onSuccess: () => {
            toast({ title: 'Password changed successfully' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.response?.data?.message || 'Failed to change password', variant: 'destructive' });
        }
    });

    // Export data mutation
    const exportMutation = useMutation({
        mutationFn: async () => {
            const res = await api.get('/users/export');
            return res.data.data;
        },
        onSuccess: (data) => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `user-data-${new Date().toISOString()}.json`;
            a.click();
            toast({ title: 'Data exported successfully' });
        },
        onError: () => {
            toast({ title: 'Error', description: 'Failed to export data', variant: 'destructive' });
        }
    });

    // Delete account mutation
    const deleteMutation = useMutation({
        mutationFn: async (password: string) => {
            const res = await api.delete('/users/account', { data: { password } });
            return res.data;
        },
        onSuccess: () => {
            toast({ title: 'Account deleted successfully' });
            setTimeout(() => logout(), 2000);
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete account', variant: 'destructive' });
        }
    });

    const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        profileMutation.mutate({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            bio: formData.get('bio')
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        passwordMutation.mutate({
            currentPassword: formData.get('currentPassword') as string,
            newPassword: formData.get('newPassword') as string
        });
        e.currentTarget.reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
        >
            <div className="mb-6 sm:mb-8 pt-4 sm:pt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your account settings and preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-0">
                    <TabsTrigger value="profile" className="text-xs sm:text-sm">
                        <User className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="text-xs sm:text-sm">
                        <Bell className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Notifications</span>
                        <span className="sm:hidden">Notify</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="text-xs sm:text-sm">
                        <Shield className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                    <TabsTrigger value="theme" className="text-xs sm:text-sm">
                        <Palette className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Theme</span>
                    </TabsTrigger>
                    <TabsTrigger value="account" className="text-xs sm:text-sm">
                        <Trash2 className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" defaultValue={user?.name} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={user?.email} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <Button type="submit" disabled={profileMutation.isPending}>
                                    {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>

                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input id="currentPassword" name="currentPassword" type="password" />
                                    </div>
                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" name="newPassword" type="password" />
                                    </div>
                                    <Button type="submit" disabled={passwordMutation.isPending}>
                                        {passwordMutation.isPending ? 'Changing...' : 'Change Password'}
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings?.emailNotifications ?? true}
                                    onChange={(e) => settingsMutation.mutate({ emailNotifications: e.target.checked })}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Label>Assignment Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get notified about new assignments</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings?.assignmentNotifications ?? true}
                                    onChange={(e) => settingsMutation.mutate({ assignmentNotifications: e.target.checked })}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Label>Course Update Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Stay updated on course changes</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings?.courseUpdateNotifications ?? true}
                                    onChange={(e) => settingsMutation.mutate({ courseUpdateNotifications: e.target.checked })}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Control your privacy preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Label>Profile Visibility</Label>
                                    <p className="text-sm text-muted-foreground">Make your profile visible to instructors</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings?.profileVisibility ?? true}
                                    onChange={(e) => settingsMutation.mutate({ profileVisibility: e.target.checked })}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <Label>Data Sharing</Label>
                                    <p className="text-sm text-muted-foreground">Share anonymous usage data</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings?.dataSharing ?? false}
                                    onChange={(e) => settingsMutation.mutate({ dataSharing: e.target.checked })}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Theme Tab */}
                <TabsContent value="theme">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Preferences</CardTitle>
                            <CardDescription>Choose your preferred theme</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {['LIGHT', 'DARK', 'SYSTEM'].map((themeOption) => (
                                    <button
                                        key={themeOption}
                                        onClick={() => {
                                            settingsMutation.mutate({ theme: themeOption as any });
                                            setThemeContext(themeOption as any);
                                        }}
                                        className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${theme === themeOption
                                                ? 'border-primary bg-primary/10 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Palette className="w-8 h-8 mx-auto mb-2" />
                                        <p className="font-medium">{themeOption.charAt(0) + themeOption.slice(1).toLowerCase()}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Management</CardTitle>
                            <CardDescription>Manage your account data and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Export Your Data</h3>
                                <p className="text-sm text-muted-foreground mb-4">Download all your data in JSON format</p>
                                <Button onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
                                    <Download className="w-4 h-4 mr-2" />
                                    {exportMutation.isPending ? 'Exporting...' : 'Export Data'}
                                </Button>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Logout All Sessions</h3>
                                <p className="text-sm text-muted-foreground mb-4">Sign out from all devices</p>
                                <Button variant="outline" onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-red-200">
                                <h3 className="font-semibold text-red-600 mb-2">Delete Account</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                                <div className="space-y-4">
                                    <Input
                                        type="password"
                                        placeholder="Enter your password to confirm"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (deletePassword) {
                                                deleteMutation.mutate(deletePassword);
                                            }
                                        }}
                                        disabled={!deletePassword || deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Account'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
