import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">Upcoming Events</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join us at these leading educational events to network, learn, and collaborate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEvents.map((event) => (
            <Card key={event.slug} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Image src={event.imageUrl} alt={event.title} width={600} height={400} className="w-full h-56 object-cover" data-ai-hint="conference education" />
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{event.description}</p>
              </CardContent>
              <CardFooter className="bg-secondary/50 p-4 flex flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary"/>
                    <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary"/>
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
