import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    number: "01",
    title: "Global Recognition",
    description:
      "Our accreditation is a mark of quality respected by institutions and employers worldwide, enhancing your global profile.",
  },
  {
    number: "02",
    title: "Rigorous Standards",
    description:
      "We employ a comprehensive, fair, and transparent evaluation process that ensures the highest standards of educational excellence.",
  },
  {
    number: "03",
    title: "Partnership in Growth",
    description:
      "We partner with institutions to foster ongoing development, innovation, and continuous improvement in education.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-24 bg-muted/40 border-y border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Why UKCAS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
            Why Choose UKCAS?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Elevate your institution&apos;s profile with an accreditation that signifies trust, quality, and global prestige.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="relative h-80 md:h-[460px] w-full overflow-hidden rounded-2xl border border-border/70 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3R1ZGVudHN8ZW58MHx8fHwxNzUzNzg2MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A team of professionals collaborating in a modern office"
                fill
                className="object-cover"
                data-ai-hint="professionals collaboration"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="flex items-start gap-4 rounded-xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                  {reason.number}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {reason.title}
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
