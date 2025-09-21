
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, X, Building, User, Key, AlertTriangle, Loader2, BookUser } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { AdminUser, ApiInstitute, UserInstituteAssignment } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

async function getUserById(id: string): Promise<AdminUser | null> {
    try {
        const response = await fetch(`/api/users?id=${id}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.status !== 'success') return null;
        const user = data.data;
        return {
            id: user.id,
            instituteName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.user_name,
            instituteAddress: '',
            registeredDate: user.created_at,
            email: user.email,
            balance: user.balance || 0,
            userName: user.user_name,
        };
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

async function getAssignments(userId: string, token: string): Promise<UserInstituteAssignment[]> {
    try {
        const response = await fetch(`/api/user-institutes?userId=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.status === 'success' ? data.data : [];
    } catch (error) {
        console.error('Failed to fetch assignments:', error);
        return [];
    }
}

async function getAllInstitutes(token: string): Promise<ApiInstitute[]> {
    try {
        const response = await fetch('/api/institutes', {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return [];
    }
}

export default function ManageAssignmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const { id } = params;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [assignments, setAssignments] = useState<UserInstituteAssignment[]>([]);
  const [allInstitutes, setAllInstitutes] = useState<ApiInstitute[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [assignmentToDelete, setAssignmentToDelete] = useState<UserInstituteAssignment | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedInstituteId, setSelectedInstituteId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const fetchAllData = async () => {
     if (typeof id !== 'string') {
        setLoading(false);
        return;
    }
    const token = sessionStorage.getItem('ukcas_token');
    if (!token) {
        router.push('/login');
        return;
    }
    setLoading(true);
    try {
        const [userData, assignmentData, instituteData] = await Promise.all([
            getUserById(id),
            getAssignments(id, token),
            getAllInstitutes(token)
        ]);
        setUser(userData);
        setAssignments(assignmentData);
        setAllInstitutes(instituteData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load assignment data.' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleUnassignConfirm = async () => {
    if (!assignmentToDelete) return;
    const token = sessionStorage.getItem('ukcas_token');
    if (!token) return;

    try {
        const response = await fetch('/api/user-institutes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ user_account: id, institute_id: assignmentToDelete.institute.id }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to unassign institute.');
        }
        setAssignments(assignments.filter(a => a.id !== assignmentToDelete.id));
        toast({ title: 'Success', description: 'Institute unassigned successfully.' });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Unassignment Failed', description: msg });
    } finally {
        setAssignmentToDelete(null);
    }
  };

  const handleAssignmentConfirm = async () => {
    if (!selectedInstituteId || !selectedRole) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select an institute and a role.' });
        return;
    }
    const token = sessionStorage.getItem('ukcas_token');
    if (!token) return;
    
    setIsAssigning(true);
    try {
        const payload = {
            institute_id: parseInt(selectedInstituteId),
            user_account: id,
            role: selectedRole,
            created_by: 'system',
            is_active: 1
        };
        const response = await fetch('/api/user-institutes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok || result.status !== 'success') {
            throw new Error(result.message || 'Failed to assign institute.');
        }
        await fetchAllData(); // Re-fetch assignments
        toast({ title: 'Success', description: 'Institute assigned successfully.' });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Assignment Failed', description: msg });
    } finally {
        setIsAssigning(false);
        setSelectedInstituteId(null);
        setSelectedRole(null);
        // Close dialog manually if it doesn't close on its own
        document.getElementById('close-assign-dialog')?.click();
    }
  };

  const availableInstitutes = allInstitutes.filter(
    inst => !assignments.some(a => a.institute.id === inst.id)
  );

  if (loading) {
    return <PageSkeleton />;
  }
  if (!user) {
    return <div className="text-center p-8"><AlertTriangle className="mx-auto h-8 w-8 text-destructive"/> User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/users" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to User List
        </Link>
        
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2"><BookUser /> Manage Assignments</h1>
                <p className="text-muted-foreground">Assignments for user: <span className="font-semibold">{user.instituteName}</span> ({user.email})</p>
            </div>
             <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Assign New Institute
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign New Institute</DialogTitle>
                        <DialogDescription>Select an institute and a role to assign to {user.instituteName}.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="institute">Institute</Label>
                            <Select onValueChange={setSelectedInstituteId} value={selectedInstituteId || undefined}>
                                <SelectTrigger id="institute">
                                    <SelectValue placeholder="Select an institute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableInstitutes.length > 0 ? availableInstitutes.map(inst => (
                                        <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                                    )) : <div className="p-4 text-sm text-center text-muted-foreground">No available institutes.</div>}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="role">Role</Label>
                             <Select onValueChange={setSelectedRole} value={selectedRole || undefined}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Institute">Institute</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild id="close-assign-dialog"><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleAssignmentConfirm} disabled={isAssigning}>
                             {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        
        {assignments.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map(assignment => (
                    <Card key={assignment.id} className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => setAssignmentToDelete(assignment)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building className="h-5 w-5" />
                                {assignment.institute.name}
                            </CardTitle>
                            <CardDescription>{assignment.institute.country}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Key className="h-4 w-4" />
                                <span>Role: <span className="font-semibold text-foreground">{assignment.role}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>Assigned on: {new Date(assignment.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No institutes are currently assigned to this user.</p>
            </div>
        )}

        <AlertDialog open={!!assignmentToDelete} onOpenChange={() => setAssignmentToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will unassign <span className="font-semibold">{assignmentToDelete?.institute.name}</span> from this user. This action can be reversed by assigning it again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUnassignConfirm} className="bg-destructive hover:bg-destructive/90">
                        Yes, Unassign
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

function PageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

