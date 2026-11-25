import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, SearchCheck, MessageSquare, ShieldCheck, Globe, BookOpen } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore the services offered by UKCAS, including institutional accreditation, certificate verification, educational consultation, and quality assurance workshops.',
  openGraph: {
    title: 'Our Services | UKCAS',
    description: 'Explore the services offered by UKCAS, including institutional accreditation, certificate verification, educational consultation, and quality assurance workshops.',
  },
};

const services = [
  {
    icon: BadgeCheck,
    title: "Institutional Accreditation",
    description: "A comprehensive evaluation of your institution against our globally recognized standards, leading to the prestigious UKCAS accreditation.",
  },
  {
    icon: SearchCheck,
    title: "Certificate Verification",
    description: "A secure, instant, and reliable online system for employers and institutions to verify the authenticity of certificates issued by your organization.",
  },
  {
    icon: MessageSquare,
    title: "Educational Consultation",
    description: "Expert guidance to help your institution navigate the complexities of international education standards and quality improvement.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance Workshops",
    description: "Tailored workshops and training for your staff on implementing best practices in educational quality assurance and curriculum development.",
  },
  {
    icon: Globe,
    title: "Global Networking",
    description: "Opportunities to connect with a worldwide network of accredited institutions to foster collaboration, partnerships, and student exchange programs.",
  },
  {
    icon: BookOpen,
    title: "Curriculum Review & Development",
    description: "In-depth analysis and support for designing and updating curricula to meet international benchmarks and industry demands.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            What We Offer
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Our Services</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            UKCAS provides a range of services to support institutions in their pursuit of educational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
