import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents } from "@/lib/mock-data";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Join UKCAS at leading educational events, conferences, and workshops. Network with peers, learn about the latest trends, and collaborate with experts.",
  openGraph: {
    title: 'Upcoming Events | UKCAS',
    description: 'Join UKCAS at leading educational events, conferences, and workshops.',
  },
};

export default function EventsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Global Summits
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Upcoming Events</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Join us at these leading educational events to network, learn, and collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <Card key={event.slug} className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="conference education"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl leading-snug">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
              </CardContent>
              <CardFooter className="border-t bg-muted/40 p-4 flex flex-col items-start gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
