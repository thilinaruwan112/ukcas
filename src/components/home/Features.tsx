import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, FileSearch, Users, GraduationCap, Calendar, Newspaper } from "lucide-react";

const features = [
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: "Institute Accreditation",
    description: "We provide rigorous and respected accreditation for higher education institutions globally.",
  },
  {
    icon: <FileSearch className="h-10 w-10 text-primary" />,
    title: "Certificate Verification",
    description: "Instantly verify the authenticity of certificates issued by our accredited partners.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Student Management",
    description: "A dedicated portal for institutes to manage student records and issue official certificates.",
  },
   {
    icon: <Newspaper className="h-10 w-10 text-primary" />,
    title: "Informative Blog",
    description: "Stay updated with the latest trends and news in the world of education and accreditation.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Upcoming Events",
    description: "Discover global educational events, workshops, and summits organized or endorsed by UKCAS.",
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: "Global Directory",
    description: "Explore our comprehensive directory of accredited institutes from around the world.",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">A Commitment to Excellence</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            UKCAS offers a comprehensive suite of services designed to uphold and advance the quality of global education.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300">
              {feature.icon}
              <CardHeader className="p-0 pt-4 pb-2">
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription>
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
