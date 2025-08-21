import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, SearchCheck, MessageSquare, ShieldCheck, Globe, BookOpen } from "lucide-react";

const services = [
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: "Institutional Accreditation",
    description: "A comprehensive evaluation of your institution against our globally recognized standards, leading to the prestigious UKCAS accreditation.",
  },
  {
    icon: <SearchCheck className="h-10 w-10 text-primary" />,
    title: "Certificate Verification",
    description: "A secure, instant, and reliable online system for employers and institutions to verify the authenticity of certificates issued by your organization.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Educational Consultation",
    description: "Expert guidance to help your institution navigate the complexities of international education standards and quality improvement.",
  },
   {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Quality Assurance Workshops",
    description: "Tailored workshops and training for your staff on implementing best practices in educational quality assurance and curriculum development.",
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Global Networking",
    description: "Opportunities to connect with a worldwide network of accredited institutions to foster collaboration, partnerships, and student exchange programs.",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Curriculum Review & Development",
    description: "In-depth analysis and support for designing and updating curricula to meet international benchmarks and industry demands.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            UKCAS provides a range of services to support institutions in their pursuit of educational excellence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300">
              {service.icon}
              <CardHeader className="p-0 pt-4 pb-2">
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardDescription>
                {service.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
