import { Logo } from "@/components/Logo";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-public-card text-public-foreground border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm">
              United Kingdom College of Advanced Studies. Setting the global standard for educational excellence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary" /></Link>
              <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 hover:text-primary" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/events" className="hover:text-primary">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Institutes</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/registration" className="hover:text-primary">Apply for Accreditation</Link></li>
              <li><Link href="/login" className="hover:text-primary">Institute Portal</Link></li>
              <li><Link href="/verify-certificate" className="hover:text-primary">Certificate Verification</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="text-sm">
              2nd Floor, College House, 17 King Edwards Road, Ruislip, London, HA4 7AE, United Kingdom<br />
              Email: <a href="mailto:info@ukcas.co.uk" className="hover:text-primary">info@ukcas.co.uk</a><br />
              Register Number: 16348189
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UKCAS. All Rights Reserved.</p>
          <p className="mt-2">
            Powered by <a href="https://payshia.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary">Payshia Software Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
