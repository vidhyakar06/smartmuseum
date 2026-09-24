import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 8,
      color: {
        dark: '#0B0D10',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    throw new Error('QR generation failed');
  }
}
