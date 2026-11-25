import { NextResponse } from 'next/server';
import {
  buildApprovedCertificatePdfBundle,
  CertificateApiError,
  PUBLIC_VERIFICATION_BASE_URL,
} from '@/lib/certificate-pdf';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json(
      { status: 'error', message: 'Authentication is required.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const certificateId = String(searchParams.get('id') || '').trim();
  if (!certificateId) {
    return NextResponse.json(
      { status: 'error', message: 'Certificate ID is required.' },
      { status: 400 }
    );
  }

  try {
    const bundle = await buildApprovedCertificatePdfBundle({
      certificateId,
      siteUrl: PUBLIC_VERIFICATION_BASE_URL,
    });

    return new NextResponse(Buffer.from(bundle.pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${bundle.filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof CertificateApiError) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: error.status }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to generate certificate PDF.';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
