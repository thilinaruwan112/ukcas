import Image from "next/image";
import { CheckCircle } from "lucide-react";

const reasons = [
    { 
        title: "Global Recognition", 
        description: "Our accreditation is a mark of quality respected by institutions and employers worldwide, enhancing your global profile." 
    },
    { 
        title: "Rigorous Standards", 
        description: "We employ a comprehensive, fair, and transparent evaluation process that ensures the highest standards of educational excellence." 
    },
    { 
        title: "Partnership in Growth", 
        description: "We partner with institutions to foster ongoing development, innovation, and continuous improvement in education." 
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose UKCAS?</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Elevate your institution's profile with an accreditation that signifies trust, quality, and global prestige.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-80 md:h-[500px] w-full">
                        <Image 
                            src="https://placehold.co/800x600.png"
                            alt="A team of professionals collaborating in a modern office"
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            data-ai-hint="professionals collaboration"
                        />
                    </div>
                    <div className="space-y-8">
                        {reasons.map((reason) => (
                            <div key={reason.title} className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                   <CheckCircle className="h-8 w-8 text-primary mt-1" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">{reason.title}</h3>
                                    <p className="text-muted-foreground">{reason.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
