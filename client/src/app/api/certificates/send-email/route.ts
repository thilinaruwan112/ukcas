import { NextResponse } from 'next/server';
import { buildApprovedCertificatePdfBundle, CertificateApiError } from '@/lib/certificate-pdf';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'Authentication is required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const certificateId = String(body.certificateId || '').trim();
    const recipientEmailOverride = body.recipientEmail ? String(body.recipientEmail).trim() : '';

    if (!certificateId) {
      return NextResponse.json(
        { status: 'error', message: 'Certificate ID is required.' },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      'https://ukcas.co.uk';

    const bundle = await buildApprovedCertificatePdfBundle({
      certificateId,
      siteUrl,
    });

    const targetEmail = recipientEmailOverride || String(bundle.certificate.email_address || '').trim();
    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      return NextResponse.json(
        { status: 'error', message: 'A valid student email address is required.' },
        { status: 400 }
      );
    }

    const pdfBase64 = Buffer.from(bundle.pdfBytes).toString('base64');

    const sendResponse = await fetch(`${bundle.apiUrl}/students-certificates/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': bundle.apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        certificate_id: certificateId,
        to_email: targetEmail,
        course_name: bundle.course?.course_name || '',
        institute_name: bundle.institute?.name || '',
        verification_url: bundle.verificationUrl,
        pdf_base64: pdfBase64,
        pdf_filename: bundle.filename,
      }),
    });

    const sendResult = await sendResponse.json().catch(() => ({}));
    if (!sendResponse.ok || sendResult.status !== 'success') {
      return NextResponse.json(
        {
          status: 'error',
          message: sendResult.message || 'Failed to send certificate email.',
        },
        { status: sendResponse.status || 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: sendResult.message || `Certificate emailed to ${targetEmail}.`,
    });
  } catch (error) {
    if (error instanceof CertificateApiError) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: error.status }
      );
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
