import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class QRCodeService {
  private QR_API_URL = 'https://api.qrserver.com/v1/create-qr-code';

  async generateQRCodeImage(data: string, size = 200): Promise<Buffer> {
    const url = `${this.QR_API_URL}?data=${encodeURIComponent(data)}&size=${size}x${size}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  }

  async generateQRCodePDF(data: string, size = 200): Promise<Buffer> {
    const qrCodeImage = await this.generateQRCodeImage(data, size);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([size + 50, size + 50]);

    const qrImageEmbed = await pdfDoc.embedPng(qrCodeImage);
    const qrImageDims = qrImageEmbed.scale(1);

    page.drawImage(qrImageEmbed, {
      x: 25,
      y: 25,
      width: qrImageDims.width,
      height: qrImageDims.height,
    });

    page.drawText(data, {
      x: 25,
      y: 10,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
