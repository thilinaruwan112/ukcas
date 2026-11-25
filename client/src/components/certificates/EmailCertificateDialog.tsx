'use client';

import { useEffect, useState } from 'react';
import { Mail, Loader2, Globe, Download, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { downloadCertificatePdf } from '@/lib/download-certificate';

interface EmailCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateId: string | null;
  studentName?: string;
  courseName?: string;
  initialEmail?: string;
  studentCountry?: string;
}

export function EmailCertificateDialog({
  open,
  onOpenChange,
  certificateId,
  studentName,
  courseName,
  initialEmail,
  studentCountry,
}: EmailCertificateDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState(initialEmail || '');
  const [resolvedStudentName, setResolvedStudentName] = useState(studentName || '');
  const [resolvedCourseName, setResolvedCourseName] = useState(courseName || '');
  const [resolvedCountry, setResolvedCountry] = useState(studentCountry || '');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !certificateId) {
      setConfirmOpen(false);
      return;
    }

    setEmail(initialEmail || '');
    setResolvedStudentName(studentName || '');
    setResolvedCourseName(courseName || '');
    setResolvedCountry(studentCountry || '');

    if (initialEmail && studentCountry) return;

    let cancelled = false;
    setLoadingDetails(true);
    fetch(`/api/verify-certificate/${encodeURIComponent(certificateId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || data?.status !== 'success' || !data?.data) return;
        const { certificate, course } = data.data;
        if (!initialEmail && certificate?.email_address) {
          setEmail(certificate.email_address);
        }
        if (certificate?.name) setResolvedStudentName(certificate.name);
        if (certificate?.country) setResolvedCountry(certificate.country);
        if (course?.course_name) setResolvedCourseName(course.course_name);
      })
      .catch(() => {
        // Allow manual email entry even if prefill fails
      })
      .finally(() => {
        if (!cancelled) setLoadingDetails(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, certificateId, initialEmail, studentName, courseName, studentCountry]);

  const handleRequestConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast({
        variant: 'destructive',
        title: 'Valid Email Required',
        description: 'Please enter a valid student email address before continuing.',
      });
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmedSend = async () => {
    if (!certificateId) return;
    const trimmedEmail = email.trim();

    const token = localStorage.getItem('ukcas_token');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in again to email certificates.',
      });
      setConfirmOpen(false);
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/certificates/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          certificateId,
          recipientEmail: trimmedEmail,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || 'Failed to send certificate email.');
      }

      toast({
        title: 'Certificate Emailed',
        description: result.message || `Official certificate PDF sent to ${trimmedEmail}.`,
      });
      setConfirmOpen(false);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Email Failed',
        description: message,
      });
      setConfirmOpen(false);
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!certificateId) return;
    const token = localStorage.getItem('ukcas_token');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in again to download certificates.',
      });
      return;
    }

    setDownloading(true);
    try {
      await downloadCertificatePdf(certificateId, token);
      toast({
        title: 'Certificate Downloaded',
        description: `Saved UKCAS-Certificate-${certificateId}.pdf`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download certificate PDF.';
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: message,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              Generate &amp; Email Certificate
            </DialogTitle>
            <DialogDescription>
              Generates the official A4 UKCAS certificate PDF with verification QR code to download or email directly to the student.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestConfirmation} className="space-y-5 pt-1">
            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-sm grid gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Certificate ID</span>
                <span className="font-mono font-semibold text-foreground">{certificateId}</span>
              </div>
              {resolvedStudentName && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Student</span>
                  <span className="font-medium text-foreground text-right">{resolvedStudentName}</span>
                </div>
              )}
              {resolvedCourseName && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0 pt-0.5">Course</span>
                  <span className="font-medium text-foreground text-right">{resolvedCourseName}</span>
                </div>
              )}
              {resolvedCountry && (
                <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    Country
                  </span>
                  <span className="font-medium text-foreground">{resolvedCountry}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email" className="text-sm font-medium">
                Student Email Address
              </Label>
              <Input
                id="student-email"
                type="email"
                placeholder={loadingDetails ? 'Loading student email...' : 'student@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loadingDetails || sending || downloading}
                className="h-11 bg-background text-foreground"
                required
              />
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                disabled={loadingDetails || sending || downloading}
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={sending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loadingDetails || sending || downloading}>
                  <Mail className="mr-2 h-4 w-4" />
                  Review &amp; Send
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={(nextOpen) => !sending && setConfirmOpen(nextOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Confirm Email Address
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground pt-1">
                <p>
                  Please verify that the email address below belongs to the student before sending the official certificate PDF:
                </p>
                <div className="rounded-lg border bg-muted/50 p-3 space-y-1 text-foreground">
                  <p className="font-semibold break-all">{email.trim()}</p>
                  {resolvedStudentName && (
                    <p className="text-xs text-muted-foreground">
                      Student: {resolvedStudentName} &bull; Certificate #{certificateId}
                    </p>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Edit Email</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmedSend();
              }}
              disabled={sending}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating &amp; Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Confirm &amp; Send Email
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
