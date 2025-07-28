import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBlogPosts } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold font-headline">UKCAS Insights</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest news, trends, and discussions in higher education and accreditation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockBlogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/blog/${post.slug}`} className="block">
                <Image src={post.imageUrl} alt={post.title} width={600} height={400} className="w-full h-64 object-cover" data-ai-hint="education learning" />
              </Link>
              <CardHeader>
                <CardTitle className="text-xl hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                 <div className="text-sm text-muted-foreground">
                    <span>By {post.author}</span> | <span>{post.date}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
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
