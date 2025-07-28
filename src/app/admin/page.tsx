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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@innovate.com',
    role: 'Applicant',
    joined: '2023-01-15',
  },
  {
    name: 'Bob Williams',
    email: 'bob@securedata.com',
    role: 'Applicant',
    joined: '2023-02-20',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.b@assessor.org',
    role: 'Assessor',
    joined: '2022-11-10',
  },
  {
    name: 'Diana Prince',
    email: 'diana.p@ukcas.gov',
    role: 'Admin',
    joined: '2022-05-01',
  },
]

const programs = [
  { id: 'ISO9001', name: 'ISO 9001:2015', sector: 'General', active: true },
  {
    id: 'ISO14001',
    name: 'ISO 14001:2015',
    sector: 'Environmental',
    active: true,
  },
  {
    id: 'ISO27001',
    name: 'ISO/IEC 27001',
    sector: 'Technology',
    active: true,
  },
  {
    id: 'ISO45001',
    name: 'ISO 45001:2018',
    sector: 'Health & Safety',
    active: false,
  },
]

export default function AdminPage() {
  return (
    <Tabs defaultValue="users">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="settings">System Config</TabsTrigger>
        </TabsList>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add New
          </span>
        </Button>
      </div>
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">User Management</CardTitle>
            <CardDescription>
              Manage all user accounts and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Joined Date
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'Admin'
                            ? 'default'
                            : user.role === 'Assessor'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {user.joined}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Suspend</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="programs">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Accreditation Programs
            </CardTitle>
            <CardDescription>
              Manage available accreditation programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.sector}</TableCell>
                    <TableCell>
                      <Badge variant={program.active ? 'default' : 'outline'}>
                        {program.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">System Configuration</CardTitle>
            <CardDescription>
              Global settings for the UKCAS platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>System configuration settings will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
