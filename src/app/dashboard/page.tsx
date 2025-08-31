
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users, GraduationCap, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCertificates, mockInstitutes } from "@/lib/mock-data";


const stats = [
    { title: "Total Students", value: "4,521", icon: <Users className="h-8 w-8 text-muted-foreground" /> },
    { title: "Certificates Issued", value: "1,234", icon: <GraduationCap className="h-8 w-8 text-muted-foreground" /> },
    { title: "Account Balance", value: `$${mockInstitutes[0].balance.toFixed(2)}`, icon: <Wallet className="h-8 w-8 text-muted-foreground" /> },
]

export default function InstituteDashboardPage() {
    return (
        <>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                 <h1 className="text-2xl font-bold">Dashboard</h1>
                 <Button asChild><Link href="/dashboard/certificates/new">Issue New Certificate</Link></Button>
            </div>

            <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/50">
                <CardContent className="p-4">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">Welcome, Global Tech University!</p>
                </CardContent>
            </Card>
           
            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                            {stat.icon}
                            <p className="text-xs text-muted-foreground">{stat.title}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recently Issued Certificates</CardTitle>
                        <CardDescription>A list of the last 5 certificates issued by your institute.</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/certificates">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Certificate ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockCertificates.filter(c => c.instituteId === '1').slice(0, 5).map(cert => (
                                <TableRow key={cert.id}>
                                    <TableCell>{cert.studentName}</TableCell>
                                    <TableCell>{cert.courseName}</TableCell>
                                    <TableCell>{cert.issueDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={cert.status === 'Pending' ? 'secondary' : cert.status === 'Approved' ? 'default' : 'destructive'}>
                                            {cert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono">{cert.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
