import { Button } from '@/components/ui/button'
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
import { Eye, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const applications = [
  {
    id: 'APP-001',
    applicant: 'Innovatech Ltd.',
    program: 'ISO 9001:2015',
    submitted: '2023-10-26',
    status: 'Pending Review',
  },
  {
    id: 'APP-002',
    applicant: 'GreenBuild Co.',
    program: 'ISO 14001:2015',
    submitted: '2023-10-24',
    status: 'Action Required',
  },
  {
    id: 'APP-003',
    applicant: 'SecureData Inc.',
    program: 'ISO/IEC 27001',
    submitted: '2023-10-22',
    status: 'Reviewed',
  },
  {
    id: 'APP-004',
    applicant: 'HealthFirst Med.',
    program: 'ISO 13485',
    submitted: '2023-10-20',
    status: 'Pending Review',
  },
  {
    id: 'APP-005',
    applicant: 'ConstructSafe',
    program: 'ISO 45001:2018',
    submitted: '2023-10-18',
    status: 'Reviewed',
  },
]

const statusVariant = (
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Pending Review':
      return 'secondary'
    case 'Action Required':
      return 'destructive'
    case 'Reviewed':
      return 'default'
    default:
      return 'outline'
  }
}

export default function AssessorPortalPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Assigned Applications</CardTitle>
          <CardDescription>
            Review and manage applications assigned to you.
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Pending Review
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Action Required</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Reviewed</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead className="hidden md:table-cell">Program</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.id}</TableCell>
                <TableCell>{app.applicant}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {app.program}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {app.submitted}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    aria-label="View application"
                    size="icon"
                    variant="ghost"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
