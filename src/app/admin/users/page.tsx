

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, UserCog, Trash2, Wallet, Loader2, AlertTriangle, Building, Eye, X, BookUser, Mail, Calendar } from "lucide-react";
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
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';


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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteClick = (user: AdminUser) => setUserToDelete(user);
    const handleEditClick = (userId: string) => router.push(`/admin/users/edit/${userId}`);
    const handleTopUpClick = (user: AdminUser) => setUserToTopUp(user);

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        
        try {
            const token = localStorage.getItem('ukcas_token');
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: userToDelete.id }),
            });

            const result = await response.json();
            if (!response.ok || result.status !== 'success') {
                throw new Error(result.message || 'Failed to delete user.');
            }

            setUsers(users.filter(user => user.id !== userToDelete.id));
            toast({
                title: "User Deleted",
                description: `The user account for ${userToDelete.instituteName} has been permanently deleted.`,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Deletion Failed', description: errorMessage });
        } finally {
            setUserToDelete(null);
        }
    };
    
    const handleTopUpConfirm = async () => {
        if (!userToTopUp || topUpAmount <= 0) return;

        try {
            const token = localStorage.getItem('ukcas_token');
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

    const MobileSkeleton = () => (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                 <Card key={i} className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8" />
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">User Maintenance</h1>
                    <p className="text-muted-foreground">Create, edit, and manage institute user accounts.</p>
                </div>
                <div className="flex w-full flex-col sm:flex-row sm:w-auto items-stretch sm:items-center gap-2">
                     <div className="relative w-full sm:w-auto sm:min-w-64">
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                       <Link href="/admin/users/new">
                           <UserPlus className="mr-2 h-4 w-4" />
                           Add New User
                       </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="hidden md:block">
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
                                    {!error && currentItems.length > 0 ? (
                                        currentItems.map((user) => (
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/users/assignments/${user.id}`}>
                                                                <BookUser className="mr-2 h-4 w-4" />
                                                                <span>Manage Assignments</span>
                                                            </Link>
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
                    </div>

                    <div className="block md:hidden p-4 space-y-4">
                        {loading ? <MobileSkeleton /> : error ? (
                             <div className="flex flex-col items-center justify-center gap-2 p-8">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                                <p className="text-destructive font-medium">Failed to load users.</p>
                                <p className="text-muted-foreground text-sm text-center">{error}</p>
                            </div>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((user) => (
                                <Card key={user.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{user.instituteName}</h3>
                                            <p className="text-sm font-medium text-muted-foreground">Balance: <span className="font-semibold text-foreground">${user.balance.toFixed(2)}</span></p>
                                        </div>
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/users/assignments/${user.id}`}>
                                                        <BookUser className="mr-2 h-4 w-4" />
                                                        <span>Manage Assignments</span>
                                                    </Link>
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
                                    </div>
                                    <Separator className="my-3" />
                                     <div className="space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2"><Mail size={14} /> {user.email}</p>
                                        <p className="flex items-center gap-2"><Calendar size={14} /> Registered: {new Date(user.registeredDate).toLocaleDateString()}</p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                <p>
                                    {searchTerm ? `No users found for "${searchTerm}".` : "No users have been created yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
                {totalPages > 1 && (
                    <div className="p-4 border-t">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
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
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
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
