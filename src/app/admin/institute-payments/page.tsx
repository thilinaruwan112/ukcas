
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

export default function InstitutePaymentsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [institutes, setInstitutes] = useState<ApiInstitute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [instituteToTopUp, setInstituteToTopUp] = useState<ApiInstitute | null>(null);
    const [topUpAmount, setTopUpAmount] = useState(0);

    const fetchInstitutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/institutes');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorData.message || `Failed to fetch institutes`);
            }
            const data = await response.json();
            setInstitutes(Array.isArray(data) ? data : []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchInstitutes();
    }, []);


    const filteredInstitutes = institutes.filter(institute =>
        institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTopUpClick = (institute: ApiInstitute) => setInstituteToTopUp(institute);

    
    const handleTopUpConfirm = async () => {
        if (!instituteToTopUp || topUpAmount <= 0) return;
        const currentBalance = instituteToTopUp.balance || 0;

        try {
            const token = sessionStorage.getItem('ukcas_token');
            const response = await fetch('/api/institutes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: instituteToTopUp.id, balance: currentBalance + topUpAmount }),
            });
            
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || 'Failed to update balance.');
            }
            
            setInstitutes(institutes.map(inst => 
                inst.id === instituteToTopUp.id 
                    ? { ...inst, balance: currentBalance + topUpAmount } 
                    : inst
            ));
            toast({
                title: "Balance Updated",
                description: `Added $${topUpAmount.toFixed(2)} to ${instituteToTopUp.name}'s balance.`,
            });
        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Update Failed', description: errorMessage });
        } finally {
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
                                        <TableCell>${(institute.balance || 0).toFixed(2)}</TableCell>
                                        <TableCell>{institute.email}</TableCell>
                                        <TableCell>{institute.country}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleTopUpClick(institute)} size="sm">
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
                    Current balance: ${(instituteToTopUp?.balance || 0).toFixed(2)}
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
