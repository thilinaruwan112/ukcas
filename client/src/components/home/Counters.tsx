import { Briefcase, Globe, Users, Award } from "lucide-react";

const stats = [
  { value: "150+", label: "Accredited Institutes", icon: Briefcase },
  { value: "45+", label: "Countries Reached", icon: Globe },
  { value: "500K+", label: "Students Benefited", icon: Users },
  { value: "25+", label: "Years of Excellence", icon: Award },
];

export default function Counters() {
  return (
    <section className="relative z-10 border-b bg-card">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-4 md:p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold tracking-tight font-headline text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
