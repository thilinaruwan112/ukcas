
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Loader2, AlertTriangle } from "lucide-react";
import type { ApiInstitute } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

async function getBalance(instituteId: string, token: string): Promise<number> {
    try {
        const response = await fetch(`/api/institute-payments/${instituteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            return 0;
        }
        const data = await response.json();
        return data.balance || 0;
    } catch (error) {
        console.error(`Failed to fetch balance for institute ${instituteId}:`, error);
        return 0;
    }
}


export default function InstitutePaymentsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [instituteToTopUp, setInstituteToTopUp] = useState<ApiInstitute | null>(null);
    const [topUpAmount, setTopUpAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchInstitutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('ukcas_token');
            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch('/api/institutes');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `Failed to fetch institutes`);
            }
            let instituteData = await response.json();
            if (!Array.isArray(instituteData)) {
                 instituteData = [];
            }
            
            const institutesWithBalances = await Promise.all(
                instituteData.map(async (institute: ApiInstitute) => {
                    const balance = await getBalance(institute.id, token);
                    return { ...institute, balance };
                })
            );

            setInstitutes(institutesWithBalances);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('ukcas_token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchInstitutes();
    }, [router]);


    const filteredInstitutes = institutes.filter(institute =>
        institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTopUpClick = (institute: ApiInstitute) => setInstituteToTopUp(institute);

    
    const handleTopUpConfirm = async () => {
        if (!instituteToTopUp || topUpAmount <= 0) return;
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('ukcas_token');
            const userStr = localStorage.getItem('ukcas_user');
            const user = userStr ? JSON.parse(userStr) : null;
            
            if (!token) {
                 throw new Error("Authentication token not found.");
            }

            const payload = {
                institute_id: instituteToTopUp.id,
                type: 'DEBIT',
                amount: topUpAmount,
                created_by: user?.user_name || 'admin',
                active_status: 1,
                remark: 'Admin top-up'
            };

            const response = await fetch('/api/institute-payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || 'Failed to process payment.');
            }
            
            toast({
                title: "Top-up Successful",
                description: `Added $${topUpAmount.toFixed(2)} to ${instituteToTopUp.name}'s account.`,
            });
            
            // Refetch institutes to get the updated balance
            await fetchInstitutes();

        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Update Failed', description: errorMessage });
        } finally {
             setIsSubmitting(false);
             setInstituteToTopUp(null);
             setTopUpAmount(0);
        }
    };

    const UserTableSkeleton = () => (
        <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
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
                            placeholder="Search institutes..."
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
                                <TableHead>Institute Name</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Country</TableHead>
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
                                                <p className="text-destructive font-medium">Failed to load institutes.</p>
                                                <p className="text-muted-foreground text-sm">{error}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!error && filteredInstitutes.length > 0 ? (
                                    filteredInstitutes.map((institute) => (
                                    <TableRow key={institute.id}>
                                        <TableCell className="font-medium">{institute.name}</TableCell>
                                        <TableCell>${Number(institute.balance || 0).toFixed(2)}</TableCell>
                                        <TableCell>{institute.email}</TableCell>
                                        <TableCell>{institute.country}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleTopUpClick(institute)} size="sm" disabled={isSubmitting}>
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
                                                    {searchTerm ? `No institutes found for "${searchTerm}".` : "No institutes found."}
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
            
            <Dialog open={!!instituteToTopUp} onOpenChange={() => { setInstituteToTopUp(null); setTopUpAmount(0); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Top-up Balance</DialogTitle>
                  <DialogDescription>
                    Enter the amount to add to the balance of <span className="font-semibold">{instituteToTopUp?.name}</span>.
                    Current balance: ${Number(instituteToTopUp?.balance || 0).toFixed(2)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="topUpAmount">Top-up Amount ($)</Label>
                    <Input 
                        id="topUpAmount" type="number" value={topUpAmount || ''}
                        onChange={(e) => setTopUpAmount(Number(e.target.value))}
                        placeholder="e.g., 50" min="0.01" step="0.01"
                        disabled={isSubmitting}
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
                  <Button onClick={handleTopUpConfirm} disabled={topUpAmount <= 0 || isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Processing..." : "Confirm Top-up"}
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </>
    );
}
