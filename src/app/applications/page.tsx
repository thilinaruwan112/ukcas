import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const accreditationPrograms = [
  {
    title: 'Quality Management',
    standard: 'ISO 9001:2015',
    description:
      "Ensure your products and services consistently meet customer's requirements, and that quality is consistently improved.",
    sector: 'Manufacturing',
    image: 'quality management',
  },
  {
    title: 'Environmental Management',
    standard: 'ISO 14001:2015',
    description:
      'Manage your environmental responsibilities in a systematic manner that contributes to the environmental pillar of sustainability.',
    sector: 'All Industries',
    image: 'environmental sustainability',
  },
  {
    title: 'Information Security',
    standard: 'ISO/IEC 27001',
    description:
      'A systematic approach to managing sensitive company information so that it remains secure.',
    sector: 'Technology',
    image: 'data security',
  },
  {
    title: 'Health & Safety',
    standard: 'ISO 45001:2018',
    description:
      'Improve employee safety, reduce workplace risks and create better, safer working conditions.',
    sector: 'Construction',
    image: 'workplace safety',
  },
]

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Accreditation Programs
        </h1>
        <p className="text-muted-foreground">
          Browse and apply for accreditation programs relevant to your industry.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accreditationPrograms.map((program) => (
          <Card key={program.title} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt={program.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={program.image}
                />
              </div>
              <CardTitle className="font-headline">{program.title}</CardTitle>
              <CardDescription>{program.standard}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {program.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="secondary">{program.sector}</Badge>
              <Button>Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
