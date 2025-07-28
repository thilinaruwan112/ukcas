import { Briefcase, Globe, Users, Award } from "lucide-react";

const stats = [
  { value: "150+", label: "Accredited Institutes", icon: <Briefcase className="h-10 w-10" /> },
  { value: "45+", label: "Countries Reached", icon: <Globe className="h-10 w-10" /> },
  { value: "500K+", label: "Students Benefited", icon: <Users className="h-10 w-10" /> },
  { value: "25+", label: "Years of Excellence", icon: <Award className="h-10 w-10" /> },
];

export default function Counters() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center p-4">
              <div className="text-primary mb-3">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-5xl font-bold font-headline text-primary">
                {stat.value}
              </p>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
