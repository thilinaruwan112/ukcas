import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import QRCode from 'qrcode';
import type { ApiInstitute, CertificateVerificationData, Course } from '@/lib/types';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const SIGNATURE_URL = 'https://content-provider.payshia.com/ukcas/institutes/1/docs/sign-updated.png';
export const PUBLIC_VERIFICATION_BASE_URL = 'https://ukcas.co.uk';

export class CertificateApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

async function fetchFromApi(url: string, apiKey: string) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CertificateApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status
    );
  }
  return response.json();
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];

  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${currentLine} ${words[i]}`;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawCenteredLines(
  page: PDFPage,
  lines: string[],
  startY: number,
  lineHeight: number,
  font: PDFFont,
  fontSize: number,
  color = rgb(0.06, 0.09, 0.14)
): number {
  let y = startY;
  for (const line of lines) {
    const width = font.widthOfTextAtSize(line, fontSize);
    page.drawText(line, {
      x: (A4_WIDTH - width) / 2,
      y,
      size: fontSize,
      font,
      color,
    });
    y -= lineHeight;
  }
  return y;
}

async function loadSignatureBytes(): Promise<Uint8Array | null> {
  try {
    const localPath = path.join(process.cwd(), 'public', 'images', 'director-signature.jpg');
    const localBytes = await fs.readFile(localPath);
    return new Uint8Array(localBytes);
  } catch {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(SIGNATURE_URL, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return null;
      return new Uint8Array(await res.arrayBuffer());
    } catch {
      return null;
    }
  }
}

async function embedSignatureImage(pdfDoc: PDFDocument, bytes: Uint8Array) {
  const isPng =
    bytes.length >= 4 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isJpg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  if (isPng) return pdfDoc.embedPng(bytes);
  if (isJpg) return pdfDoc.embedJpg(bytes);

  try {
    return await pdfDoc.embedPng(bytes);
  } catch {
    return pdfDoc.embedJpg(bytes);
  }
}

export async function generateCertificatePdf(params: {
  certificate: CertificateVerificationData;
  institute: ApiInstitute;
  course: Course;
  verificationUrl: string;
}): Promise<Uint8Array> {
  const { certificate, institute, course, verificationUrl } = params;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const letterheadPath = path.join(process.cwd(), 'public', 'images', 'certificate-letterhead.png');
  const letterheadBytes = await fs.readFile(letterheadPath);
  const letterheadImage = await pdfDoc.embedPng(letterheadBytes);
  page.drawImage(letterheadImage, {
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
  });

  const maxTextWidth = A4_WIDTH - 130;
  let y = 638;

  y = drawCenteredLines(page, ['This is to certify that'], y, 22, timesRoman, 13);
  y -= 8;

  const studentLines = wrapText(certificate.name || 'Student', timesBold, 24, maxTextWidth);
  y = drawCenteredLines(page, studentLines, y, 28, timesBold, 24);
  y -= 6;

  y = drawCenteredLines(
    page,
    [
      'has completed the United Kingdom College of Advanced Studies',
      'endorsed course of learning',
    ],
    y,
    17,
    timesRoman,
    11.5
  );
  y -= 12;

  const courseLines = wrapText(course?.course_name || 'Endorsed Course', timesBold, 19, maxTextWidth);
  y = drawCenteredLines(page, courseLines, y, 23, timesBold, 19);
  y -= 6;

  y = drawCenteredLines(
    page,
    [
      'and completed the final examination in accordance with the standards of',
      'United Kingdom College of Advanced Studies.',
    ],
    y,
    17,
    timesRoman,
    11.5
  );

  const awardedOn = certificate.created_at
    ? new Date(certificate.created_at).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  const rows: Array<[string, string]> = [
    ['Course Duration', course?.duration || '-'],
    ['Awarded On', awardedOn],
    ['Certificate Number', String(certificate.certificate_id)],
    ['Training Partner', institute?.name || '-'],
    ['LPC', institute?.code || '-'],
  ];

  let tableY = Math.min(y - 26, 392);
  const labelX = 118;
  const valueX = 250;

  for (const [label, value] of rows) {
    page.drawText(label, {
      x: labelX,
      y: tableY,
      size: 11.5,
      font: helveticaBold,
      color: rgb(0.1, 0.12, 0.16),
    });

    const valueLines = wrapText(`: ${value}`, helvetica, 11.5, A4_WIDTH - valueX - 72);
    for (const vLine of valueLines) {
      page.drawText(vLine, {
        x: valueX,
        y: tableY,
        size: 11.5,
        font: helvetica,
        color: rgb(0.1, 0.12, 0.16),
      });
      tableY -= 16;
    }
    tableY -= 6;
  }

  const signBytes = await loadSignatureBytes();
  if (signBytes) {
    try {
      const signImage = await embedSignatureImage(pdfDoc, signBytes);
      const dims = signImage.scaleToFit(155, 52);
      page.drawImage(signImage, {
        x: 72,
        y: 173,
        width: dims.width,
        height: dims.height,
      });
    } catch {
      // Skip signature image if bytes cannot be embedded
    }
  }

  page.drawLine({
    start: { x: 72, y: 168 },
    end: { x: 242, y: 168 },
    thickness: 1.2,
    color: rgb(0, 0, 0),
  });
  page.drawText('Director of Accreditation', {
    x: 72,
    y: 154,
    size: 10,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  page.drawText('United Kingdom College of Advanced Studies', {
    x: 72,
    y: 141,
    size: 9.5,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  const qrBuffer = await QRCode.toBuffer(verificationUrl, {
    errorCorrectionLevel: 'H',
    width: 240,
    margin: 1,
  });
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  page.drawImage(qrImage, {
    x: A4_WIDTH - 72 - 86,
    y: 136,
    width: 86,
    height: 86,
  });

  return pdfDoc.save();
}

export async function buildApprovedCertificatePdfBundle(params: {
  certificateId: string;
  siteUrl?: string;
}) {
  const { certificateId, siteUrl = PUBLIC_VERIFICATION_BASE_URL } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new CertificateApiError('API URL or Key is not configured.', 500);
  }

  const certificateResult = await fetchFromApi(
    `${apiUrl}/students-certificates/certificate/${encodeURIComponent(certificateId)}`,
    apiKey
  );

  if (certificateResult.status !== 'success' || !certificateResult.data) {
    throw new CertificateApiError('Certificate not found.', 404);
  }

  const certificate: CertificateVerificationData = certificateResult.data;
  if (String(certificate.approved_status || '').toLowerCase() !== 'approved') {
    throw new CertificateApiError('Only approved certificates can be generated.', 400);
  }

  const [institute, courseResult] = await Promise.all([
    fetchFromApi(`${apiUrl}/institutes/${certificate.institute_id}`, apiKey),
    fetchFromApi(`${apiUrl}/institute-courses/${certificate.course_id}`, apiKey),
  ]);
  const course: Course = courseResult.data;

  const verificationUrl = `${siteUrl.replace(/\/$/, '')}/verify-certificate?id=${encodeURIComponent(certificateId)}`;
  const pdfBytes = await generateCertificatePdf({
    certificate,
    institute,
    course,
    verificationUrl,
  });

  return {
    apiUrl,
    apiKey,
    certificate,
    institute: institute as ApiInstitute,
    course,
    verificationUrl,
    pdfBytes,
    filename: `UKCAS-Certificate-${certificateId}.pdf`,
  };
}
