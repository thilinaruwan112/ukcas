import Image from "next/image";
import { BadgeCheck, Globe, Scale } from "lucide-react";
import type { Metadata } from 'next';
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission, vision, and values of the United Kingdom College of Advanced Studies (UKCAS). Discover our commitment to fostering educational excellence worldwide.',
  openGraph: {
    title: 'About Us | UKCAS',
    description: 'Learn about the mission, vision, and values of the United Kingdom College of Advanced Studies (UKCAS).',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558989292-769fbc427975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxvdXIlMjBtaXNzaW9ufGVufDB8fHx8MTc1Mzc4NjEwOXww&ixlib=rb-4.1.0&q=80&w=1080',
        width: 1200,
        height: 630,
        alt: 'Our Mission at UKCAS',
      },
    ],
  },
};

const pillars = [
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "To be the world's most trusted and respected accreditation body, recognized for our commitment to quality, innovation, and integrity in education.",
  },
  {
    icon: BadgeCheck,
    title: "Our Values",
    description:
      "Integrity, Excellence, Collaboration, and Transparency are the pillars of our organization, guiding every decision we make.",
  },
  {
    icon: Scale,
    title: "Rigorous Standards",
    description:
      "Our accreditation framework is built on comprehensive criteria that assess every aspect of an institution's operations.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 space-y-20">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            About UKCAS
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">About UKCAS</h1>
          <p className="text-base md:text-xl text-muted-foreground">
            The United Kingdom College of Advanced Studies is dedicated to fostering and recognizing educational excellence across the globe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative h-80 md:h-[420px] w-full overflow-hidden rounded-2xl border border-border/70 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1558989292-769fbc427975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxvdXIlMjBtaXNzaW9ufGVufDB8fHx8MTc1Mzc4NjEwOXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Group of professionals in a meeting"
              fill
              className="object-cover"
              data-ai-hint="professionals meeting"
            />
          </div>
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Who We Are</span>
            <h2 className="text-3xl font-bold font-headline tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our mission is to establish, maintain, and promote the highest standards of quality in education through a rigorous, fair, and transparent accreditation process. We aim to empower institutions to achieve their full potential and to provide students and employers with a trusted benchmark for academic and professional excellence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that quality education is the cornerstone of progress and we are committed to being a leading force in its advancement worldwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="p-7 text-center flex flex-col items-center space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
