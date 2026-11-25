'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useI18n } from "@/context/i18n-provider";
import { ArrowRight, ShieldCheck, Search, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const { t } = useI18n();
  const router = useRouter();
  const [verifyId, setVerifyId] = useState("");

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = verifyId.trim();
    if (!trimmed) {
      router.push("/verify-certificate");
      return;
    }
    router.push(`/verify-certificate?id=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Ambient gradient & subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(159,31,45,0.45),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(159,31,45,0.22),_transparent_55%)]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-amber-200 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>UK Register of Learning Providers &bull; UKPRN 10099298</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-headline leading-[1.1] text-white">
              {t('Hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t('Hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button size="lg" asChild className="rounded-full px-7 h-12 text-base shadow-lg shadow-primary/30">
                <Link href="/registration">
                  {t('Hero.button1')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 h-12 text-base border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link href="/institutes">{t('Hero.button2')}</Link>
              </Button>
            </div>

            {/* Instant Certificate Verification Bar */}
            <form
              onSubmit={handleQuickVerify}
              className="mt-4 max-w-xl rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input
                    type="text"
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    placeholder="Enter 6-digit Certificate ID to verify..."
                    className="h-11 border-0 bg-transparent pl-10 text-white placeholder:text-slate-300/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button type="submit" variant="secondary" className="h-11 rounded-xl px-5 font-semibold shrink-0">
                  Verify Certificate
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1534009916851-7850ba974f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8Z3JhZHVhdGV8ZW58MHx8fHwxNzUxMzAwNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="University campus"
                  fill
                  className="object-cover"
                  data-ai-hint="university campus building"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              </div>

              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 rounded-xl border border-white/15 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Globally Recognized</p>
                    <p className="text-xs text-slate-400">QR-verified official credentials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
