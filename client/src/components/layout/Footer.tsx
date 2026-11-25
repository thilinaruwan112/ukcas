import { Logo } from "@/components/Logo";
import { Facebook, Twitter, Linkedin, Mail, MapPin, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="container mx-auto py-14 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="white" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              United Kingdom College of Advanced Studies (UKCAS). Setting a trusted global benchmark for institutional accreditation and credential verification.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-primary hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-primary hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-primary hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/institutes" className="text-slate-400 hover:text-white transition-colors">Institutes</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/events" className="text-slate-400 hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">For Institutes</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/registration" className="text-slate-400 hover:text-white transition-colors">Apply for Accreditation</Link></li>
              <li><Link href="/login" className="text-slate-400 hover:text-white transition-colors">Institute &amp; Admin Portal</Link></li>
              <li><Link href="/verify-certificate" className="text-slate-400 hover:text-white transition-colors">Certificate Verification</Link></li>
            </ul>
            <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                UKPRN: 10099298
              </div>
              <p className="text-slate-400">Company Reg: 16348189</p>
              <a
                href="https://www.ukrlp.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4"
              >
                Verify on UKRLP
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact Us</h4>
            <div className="text-sm space-y-3 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>182-184 High Street North, East Ham, London, E6 2JA, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:info@ukcas.co.uk" className="hover:text-white transition-colors">
                  info@ukcas.co.uk
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} United Kingdom College of Advanced Studies (UKCAS). All Rights Reserved.</p>
          <p>International Accreditation &amp; Credential Verification</p>
        </div>
      </div>
    </footer>
  );
}
