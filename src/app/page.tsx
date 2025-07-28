import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, FileText, CheckCircle2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              In-Progress Applications
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Approved Accreditations
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              ISO 9001, ISO 14001, etc.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Next deadline in 14 days
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Application Status</CardTitle>
          <CardDescription>
            Track the status of your ongoing applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Updated
                </TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Quality Management Systems</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    ISO 9001:2015
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Under Review</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
                <TableCell>
                  <Progress value={65} aria-label="65% complete" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Environmental Management</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    ISO 14001:2015
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Initial Submission</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2023-06-26</TableCell>
                <TableCell>
                  <Progress value={25} aria-label="25% complete" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="font-medium">Information Security</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    ISO/IEC 27001
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>Approved</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2023-06-15</TableCell>
                <TableCell>
                  <Progress value={100} aria-label="100% complete" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
