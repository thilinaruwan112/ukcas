import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Cta() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 md:p-16 text-center text-white shadow-2xl border border-slate-800">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(159,31,45,0.45),_transparent_60%)]"
          />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-amber-200">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              <span>Join Our Accredited Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
              Elevate Your Institution&apos;s Prestige
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              Join a global network of esteemed institutions. A UKCAS accreditation demonstrates your commitment to educational excellence and opens doors to new opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button size="lg" asChild className="rounded-full px-7 h-12 text-base">
                <Link href="/registration">
                  Apply for Accreditation Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-7 h-12 text-base border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/verify-certificate">Verify a Certificate</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
