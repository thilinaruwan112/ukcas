
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, UserCog, Trash2, Wallet, Loader2, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { AdminUser } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserMaintenancePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [userToTopUp, setUserToTopUp] = useState<AdminUser | null>(null);
    const [topUpAmount, setTopUpAmount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(errorData.message || `Failed to fetch users`);
                }

                const data = await response.json();
                
                if (data.status === 'success' && Array.isArray(data.data)) {
                     // Assuming API data structure matches AdminUser partially. Adapt as needed.
                    const formattedUsers: AdminUser[] = data.data.map((user: any) => ({
                        id: user.id,
                        instituteName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.user_name,
                        instituteAddress: [user.addressl1, user.addressl2, user.city].filter(Boolean).join(', '),
                        registeredDate: user.created_at,
                        email: user.email,
                        balance: user.balance || 0, // Assuming balance is available
                    }));
                    setUsers(formattedUsers);
                } else {
                    throw new Error(data.message || "Invalid data structure received from server.");
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(errorMessage);
                toast({
                    variant: 'destructive',
                    title: 'Error fetching users',
                    description: errorMessage
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);


    const filteredUsers = users.filter(user =>
        user.instituteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user: AdminUser) => {
        setUserToDelete(user);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            // Add API call to delete user here
            setUsers(users.filter(user => user.id !== userToDelete.id));
            toast({
                title: "User Deleted",
                description: `The user for ${userToDelete.instituteName} has been successfully deleted.`,
            });
            setUserToDelete(null);
        }
    };

    const handleEditClick = (userId: string) => {
        router.push(`/admin/users/edit/${userId}`);
    };

    const handleTopUpClick = (user: AdminUser) => {
        setUserToTopUp(user);
    };

    const handleTopUpConfirm = () => {
        if (userToTopUp && topUpAmount > 0) {
            // Add API call to top-up balance here, using JWT token for POST
            setUsers(users.map(user => 
                user.id === userToTopUp.id 
                    ? { ...user, balance: user.balance + topUpAmount } 
                    : user
            ));
            toast({
                title: "Balance Updated",
                description: `Added $${topUpAmount.toFixed(2)} to ${userToTopUp.instituteName}'s balance.`,
            });
            setUserToTopUp(null);
            setTopUpAmount(0);
        }
    };
    
    const UserTableSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
                    <h1 className="text-2xl font-bold">User Maintenance</h1>
                    <p className="text-muted-foreground">Create, edit, and manage institute user accounts.</p>
                </div>
                <div className="flex w-full sm:w-auto sm:justify-end items-center gap-2">
                     <div className="relative w-full sm:w-64">
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button asChild>
                       <Link href="/admin/users/new">
                           <UserPlus className="mr-2 h-4 w-4" />
                           Add New User
                       </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Institute Name</TableHead>
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditClick(user.id)}>
                                                        <UserCog className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleTopUpClick(user)}>
                                                        <Wallet className="mr-2 h-4 w-4" />
                                                        <span>Top-up Balance</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-500 focus:text-red-500"
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                    !error && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <p className="text-muted-foreground">
                                                        {searchTerm ? `No users found for "${searchTerm}".` : "No users have been created yet."}
                                                    </p>
                                                    {!searchTerm && (
                                                        <Button asChild size="sm">
                                                            <Link href="/admin/users/new">
                                                                <UserPlus className="mr-2 h-4 w-4" />
                                                                Add New User
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        )}
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for <span className="font-semibold">{userToDelete?.instituteName}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, delete user
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Dialog open={!!userToTopUp} onOpenChange={() => { setUserToTopUp(null); setTopUpAmount(0); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Top-up Balance</DialogTitle>
                  <DialogDescription>
                    Enter the amount to add to the balance of <span className="font-semibold">{userToTopUp?.instituteName}</span>.
                    Current balance: ${userToTopUp?.balance.toFixed(2)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="topUpAmount">Top-up Amount ($)</Label>
                    <Input 
                        id="topUpAmount"
                        type="number"
                        value={topUpAmount || ''}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        placeholder="e.g., 50"
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleTopUpConfirm} disabled={topUpAmount <= 0}>Confirm Top-up</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </>
    );
}
