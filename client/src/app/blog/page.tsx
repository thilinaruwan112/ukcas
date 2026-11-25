import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBlogPosts } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - UKCAS Insights',
  description: 'Stay informed with the latest news, trends, and discussions in higher education and accreditation from the experts at UKCAS.',
  openGraph: {
    title: 'Blog - UKCAS Insights',
    description: 'Stay informed with the latest news, trends, and discussions in higher education and accreditation from the experts at UKCAS.',
  },
};

export default function BlogPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Editorial &amp; News
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">UKCAS Insights</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Stay informed with the latest news, trends, and discussions in higher education and accreditation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockBlogPosts.map((post) => (
            <Card key={post.slug} className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="education learning"
                />
              </Link>
              <CardHeader>
                <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t bg-muted/30 px-6 py-4">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{post.author}</span> &bull; <span>{post.date}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
