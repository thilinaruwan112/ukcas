import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-lg p-10 md:p-16 text-center text-primary-foreground shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Elevate Your Institution's Prestige
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join a global network of esteemed institutions. A UKCAS accreditation demonstrates your commitment to educational excellence and opens doors to new opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/registration">Apply for Accreditation Today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
