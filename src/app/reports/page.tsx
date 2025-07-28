'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const applicationTrendsData = [
  { month: 'Jan', submitted: 4, approved: 2 },
  { month: 'Feb', submitted: 3, approved: 1 },
  { month: 'Mar', submitted: 5, approved: 3 },
  { month: 'Apr', submitted: 7, approved: 4 },
  { month: 'May', submitted: 6, approved: 5 },
  { month: 'Jun', submitted: 8, approved: 5 },
]

const applicationTrendsConfig = {
  submitted: {
    label: 'Submitted',
    color: 'hsl(var(--primary))',
  },
  approved: {
    label: 'Approved',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig

const assessmentOutcomesData = [
  { name: 'Approved', count: 250, fill: 'hsl(142.1 76.2% 36.3%)' },
  { name: 'Minor Revisions', count: 120, fill: 'hsl(47.9 95.8% 53.1%)' },
  { name: 'Major Revisions', count: 80, fill: 'hsl(24.6 95% 53.1%)' },
  { name: 'Rejected', count: 45, fill: 'hsl(0 84.2% 60.2%)' },
]

const assessmentOutcomesConfig = {
  count: { label: 'Count' },
} satisfies ChartConfig

export default function ReportsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Application Trends</CardTitle>
          <CardDescription>
            Submitted vs. Approved applications over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={applicationTrendsConfig}
            className="min-h-[300px] w-full"
          >
            <BarChart accessibilityLayer data={applicationTrendsData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend />
              <Bar dataKey="submitted" fill="var(--color-submitted)" radius={4} />
              <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Assessment Outcomes</CardTitle>
          <CardDescription>
            Breakdown of all assessment final decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={assessmentOutcomesConfig}
            className="min-h-[300px] w-full"
          >
            <BarChart layout="vertical" accessibilityLayer data={assessmentOutcomesData}>
              <CartesianGrid horizontal={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={100}
              />
              <XAxis type="number" dataKey="count" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" layout="vertical" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
