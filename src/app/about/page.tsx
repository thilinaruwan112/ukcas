import Image from "next/image";
import { BadgeCheck, Globe, Scale } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">About UKCAS</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The United Kingdom College of Advanced Studies is dedicated to fostering and recognizing educational excellence across the globe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 md:h-96 w-full">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Group of professionals in a meeting"
              fill
              className="object-cover rounded-lg shadow-lg"
              data-ai-hint="professionals meeting"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
            <p className="text-muted-foreground">
              Our mission is to establish, maintain, and promote the highest standards of quality in education through a rigorous, fair, and transparent accreditation process. We aim to empower institutions to achieve their full potential and to provide students and employers with a trusted benchmark for academic and professional excellence.
            </p>
            <p className="text-muted-foreground">
              We believe that quality education is the cornerstone of progress and we are committed to being a leading force in its advancement worldwide.
            </p>
          </div>
        </div>

        <div className="mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Globe className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Vision</h3>
                <p className="text-muted-foreground">To be the world's most trusted and respected accreditation body, recognized for our commitment to quality, innovation, and integrity in education.</p>
              </div>
              <div className="p-6">
                <BadgeCheck className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                <p className="text-muted-foreground">Integrity, Excellence, Collaboration, and Transparency are the pillars of our organization, guiding every decision we make.</p>
              </div>
              <div className="p-6">
                <Scale className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rigorous Standards</h3>
                <p className="text-muted-foreground">Our accreditation framework is built on comprehensive criteria that assess every aspect of an institution's operations.</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
