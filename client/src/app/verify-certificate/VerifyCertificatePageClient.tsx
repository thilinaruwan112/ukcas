'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSearch, CheckCircle, XCircle, Loader2, BookOpen as BookIcon, Calendar, Building, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApiInstitute, Course, CertificateVerificationData } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

interface VerificationResult {
  certificate: CertificateVerificationData;
  institute: ApiInstitute;
  course: Course;
}

export function VerifyCertificatePageClient() {
  const searchParams = useSearchParams();
  const initialCertId = searchParams.get('id');

  const [certificateId, setCertificateId] = useState(initialCertId || "");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certificateId.trim()) {
      setError("Please enter a Certificate ID.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`/api/verify-certificate/${certificateId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      if (data.status === 'success') {
        setResult(data.data);
      } else {
        throw new Error(data.message || `Certificate with ID "${certificateId}" not found.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertId) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCertId]);

  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(125,28,38,0.07),_transparent_55%)]" />
      <div className="container relative mx-auto px-4 md:px-6 flex flex-col items-center gap-8">
        <div className="text-center space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official Registry
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Verify a Certificate</h1>
          <p className="text-muted-foreground">
            Enter the unique certificate ID to instantly verify the authenticity of a UKCAS-endorsed qualification.
          </p>
        </div>

        <Card className="w-full max-w-xl shadow-xl border-border/70">
          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FileSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <label htmlFor="certificateId" className="sr-only">Certificate ID</label>
                  <Input
                    id="certificateId"
                    placeholder="Enter 6-digit Certificate ID"
                    className="h-12 pl-11 text-base font-mono tracking-wider"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="h-12 px-7 text-base font-medium shrink-0" size="lg" disabled={isLoading || !certificateId}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && !isLoading && (
          <Card className="w-full max-w-xl bg-destructive/5 border-destructive/40 shadow-lg animate-in fade-in-50">
            <CardHeader className="text-center items-center pb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
                <XCircle className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-headline">Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm font-medium text-muted-foreground pb-6">
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {result && !isLoading && (
          <Card className="w-full max-w-xl border-emerald-500/30 shadow-xl overflow-hidden animate-in fade-in-50">
            <CardHeader className="text-center items-center bg-emerald-500/10 border-b border-emerald-500/20 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-headline text-emerald-700 dark:text-emerald-400">
                Certificate Verified
              </CardTitle>
              <CardDescription>This credential is authentic and registered with UKCAS.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid gap-5 text-sm">
              <div className="flex flex-col space-y-1 text-center border-b pb-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Awarded To</span>
                <span className="font-bold text-2xl font-headline text-foreground">{result.certificate.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem icon={<FileSearch size={15} />} label="Certificate ID" value={result.certificate.certificate_id.toString()} mono />
                <InfoItem icon={<Calendar size={15} />} label="Issue Date" value={new Date(result.certificate.created_at).toLocaleDateString('en-GB')} />
              </div>

              <InfoItem icon={<BookIcon size={15} />} label="Qualification / Course" value={result.course.course_name} />

              <Separator />

              <div className="flex flex-col space-y-1 text-center">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Issuing Training Partner</span>
                <span className="font-semibold text-lg">{result.institute.name}</span>
              </div>

              <div className="flex justify-between items-center bg-muted/60 border p-3.5 rounded-xl">
                <span className="text-muted-foreground font-medium flex items-center gap-2">
                  <Building size={16} /> Accreditation Status
                </span>
                <Badge variant={result.institute.accreditation_status === 'Accredited' ? 'default' : 'secondary'}>
                  {result.institute.accreditation_status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon, mono = false }: { label: string; value: string; icon: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
      <p className="text-muted-foreground text-xs flex items-center gap-1.5">{icon} {label}</p>
      <p className={`font-semibold text-foreground ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
