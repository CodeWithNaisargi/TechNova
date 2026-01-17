import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    avatar?: string;
    createdAt: string;
    _count?: {
        enrollments: number;
        courses: number;
    };
}

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT' as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
    });

    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch users
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users', roleFilter],
        queryFn: async () => {
            const params = roleFilter !== 'all' ? `?role=${roleFilter}` : '';
            const res = await api.get(`/admin/users${params}`);
            return res.data.data as User[];
        },
    });

    // Create user mutation
    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await api.post('/admin/users', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast({ title: 'Success', description: 'User created successfully' });
            setCreateModalOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create user',
                variant: 'destructive',
            });
        },
    });

    // Update user mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
            const res = await api.put(`/admin/users/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast({ title: 'Success', description: 'User updated successfully' });
            setEditModalOpen(false);
            setSelectedUser(null);
            resetForm();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update user',
                variant: 'destructive',
            });
        },
    });

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`/admin/users/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast({ title: 'Success', description: 'User deleted successfully' });
            setDeleteModalOpen(false);
            setSelectedUser(null);
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete user',
                variant: 'destructive',
            });
        },
    });

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'STUDENT',
        });
    };

    const handleCreate = () => {
        createMutation.mutate(formData);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setEditModalOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedUser) return;
        const updateData: any = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
        };
        if (formData.password) {
            updateData.password = formData.password;
        }
        updateMutation.mutate({ id: selectedUser.id, data: updateData });
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            deleteMutation.mutate(selectedUser.id);
        }
    };

    // Filter users by search term
    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800';
            case 'INSTRUCTOR':
                return 'bg-blue-100 text-blue-800';
            case 'STUDENT':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 sm:pt-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage all platform users</p>
                </div>
                <Button 
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="STUDENT">Students</SelectItem>
                                <SelectItem value="INSTRUCTOR">Instructors</SelectItem>
                                <SelectItem value="ADMIN">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                        <Users className="w-5 h-5" />
                        Users ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-[600px] sm:min-w-0">
                            <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Enrollments</TableHead>
                                <TableHead>Courses</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user._count?.enrollments || 0}</TableCell>
                                        <TableCell>{user._count?.courses || 0}</TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create User Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                            Add a new user to the platform
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Updating...' : 'Update User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
