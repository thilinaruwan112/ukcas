
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, UserCog, Trash2, Wallet, Loader2, AlertTriangle, Building, Eye, X, BookUser } from "lucide-react";
import Link from 'next/link';
import { AdminUser, ApiInstitute } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';


export default function InstitutePaymentsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [userToTopUp, setUserToTopUp] = useState<AdminUser | null>(null);
    const [topUpAmount, setTopUpAmount] = useState(0);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `Failed to fetch users`);
            }
            const data = await response.json();
            if (data.status === 'success' && Array.isArray(data.data)) {
                const formattedUsers: AdminUser[] = data.data.map((user: any) => ({
                    id: user.id,
                    userName: user.user_name,
                    instituteName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.user_name,
                    instituteAddress: [user.addressl1, user.addressl2, user.city].filter(Boolean).join(', '),
                    registeredDate: user.created_at,
                    email: user.email,
                    balance: user.balance || 0,
                    assignedInstitutes: user.institutes || [],
                }));
                setUsers(formattedUsers);
            } else {
                throw new Error(data.message || "Invalid data structure received from server.");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, []);


    const filteredUsers = users.filter(user =>
        user.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (userId: string) => router.push(`/admin/users/edit/${userId}`);
    const handleTopUpClick = (user: AdminUser) => setUserToTopUp(user);

    
    const handleTopUpConfirm = async () => {
        if (!userToTopUp || topUpAmount <= 0) return;

        try {
            const token = sessionStorage.getItem('ukcas_token');
            const response = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: userToTopUp.id, balance: userToTopUp.balance + topUpAmount }),
            });
            
            const result = await response.json();
            if (!response.ok || result.status !== 'success') {
                 throw new Error(result.message || 'Failed to update balance.');
            }
            
            setUsers(users.map(user => 
                user.id === userToTopUp.id 
                    ? { ...user, balance: user.balance + topUpAmount } 
                    : user
            ));
            toast({
                title: "Balance Updated",
                description: `Added $${topUpAmount.toFixed(2)} to ${userToTopUp.instituteName}'s balance.`,
            });
        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Update Failed', description: errorMessage });
        } finally {
             setUserToTopUp(null);
             setTopUpAmount(0);
        }
    };

    const UserTableSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Institute Payments</h1>
                    <p className="text-muted-foreground">Manage and top up institute account balances.</p>
                </div>
                <div className="flex w-full sm:w-auto sm:justify-end items-center gap-2">
                     <div className="relative w-full sm:w-64">
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User/Institute Name</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Registered Date</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        {loading ? <UserTableSkeleton /> : (
                            <TableBody>
                                {error && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                                <p className="text-destructive font-medium">Failed to load users.</p>
                                                <p className="text-muted-foreground text-sm">{error}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!error && filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.instituteName}</TableCell>
                                        <TableCell>${user.balance.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(user.registeredDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleTopUpClick(user)} size="sm">
                                                <Wallet className="mr-2 h-4 w-4" />
                                                <span>Top-up</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    !error && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center">
                                                <p className="text-muted-foreground">
                                                    {searchTerm ? `No users found for "${searchTerm}".` : "No users have been created yet."}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>
            
            <Dialog open={!!userToTopUp} onOpenChange={() => { setUserToTopUp(null); setTopUpAmount(0); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Top-up Balance</DialogTitle>
                  <DialogDescription>
                    Enter the amount to add to the balance of <span className="font-semibold">{userToTopUp?.instituteName}</span>.
                    Current balance: ${userToTopUp?.balance.toFixed(2)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="topUpAmount">Top-up Amount ($)</Label>
                    <Input 
                        id="topUpAmount" type="number" value={topUpAmount || ''}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        placeholder="e.g., 50" min="0.01" step="0.01"
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleTopUpConfirm} disabled={topUpAmount <= 0}>Confirm Top-up</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </>
    );
}
