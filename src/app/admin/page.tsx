import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, Users, CheckSquare, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const topStats = [
    { title: "Total Registered Institutes", value: "147", icon: <ClipboardList className="h-8 w-8 text-muted-foreground" /> },
    { title: "Active Student Registrations", value: "4,521", icon: <Users className="h-8 w-8 text-muted-foreground" /> },
    { title: "Total Certifications Issued", value: "2,350", icon: <CheckSquare className="h-8 w-8 text-muted-foreground" /> },
    { title: "Pending Institute Requests", value: "12", icon: <Hourglass className="h-8 w-8 text-muted-foreground" /> },
];

export default function AdminDashboardPage() {
    return (
        <>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/50">
                <CardContent className="p-4">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">Hi, Good morning!</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {topStats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                            {stat.icon}
                            <p className="text-xs text-muted-foreground">{stat.title}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">System Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total Institutes</span>
                            <span className="font-bold">147</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Certificates Issued</span>
                            <span className="font-bold">2,350</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Total Revenue</span>
                            <span className="font-bold text-green-600">$23,500</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Pending Institute Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48">
                         <div className="text-center text-muted-foreground">
                            <p>No Pending Institutes</p>
                            <p className="text-sm">All institute requests have been processed</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
