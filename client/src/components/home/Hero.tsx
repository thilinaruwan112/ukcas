'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/context/i18n-provider";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-headline">
            {t('Hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80">
            {t('Hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild variant="secondary">
              <Link href="/registration">{t('Hero.button1')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/20" asChild>
              <Link href="/institutes">{t('Hero.button2')}</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-full w-full">
           <Image 
             src="https://images.unsplash.com/photo-1534009916851-7850ba974f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8Z3JhZHVhdGV8ZW58MHx8fHwxNzUxMzAwNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
             alt="University campus"
             fill
             className="object-cover rounded-lg shadow-2xl"
             data-ai-hint="university campus building"
           />
        </div>
      </div>
    </section>
  );
}
