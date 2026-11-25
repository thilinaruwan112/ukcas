/**
 * Downloads the generated A4 UKCAS certificate PDF for an approved certificate.
 */
export async function downloadCertificatePdf(certificateId: string, token: string): Promise<void> {
  const response = await fetch(`/api/certificates/download?id=${encodeURIComponent(certificateId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate certificate PDF.');
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `UKCAS-Certificate-${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
