import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, FileSearch, Users, GraduationCap, Calendar, Newspaper } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Institute Accreditation",
    description: "We provide rigorous and respected accreditation for higher education institutions globally.",
  },
  {
    icon: FileSearch,
    title: "Certificate Verification",
    description: "Instantly verify the authenticity of certificates issued by our accredited partners.",
  },
  {
    icon: Users,
    title: "Student Management",
    description: "A dedicated portal for institutes to manage student records and issue official certificates.",
  },
  {
    icon: Newspaper,
    title: "Informative Blog",
    description: "Stay updated with the latest trends and news in the world of education and accreditation.",
  },
  {
    icon: Calendar,
    title: "Upcoming Events",
    description: "Discover global educational events, workshops, and summits organized or endorsed by UKCAS.",
  },
  {
    icon: GraduationCap,
    title: "Global Directory",
    description: "Explore our comprehensive directory of accredited institutes from around the world.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Our Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
            A Commitment to Excellence
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            UKCAS offers a comprehensive suite of services designed to uphold and advance the quality of global education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
