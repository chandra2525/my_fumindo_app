import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QRCodeService } from './qrCode.service';
import { Response } from 'express';

@Controller('qr_code')
@UseGuards(JwtAuthGuard)
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Get('download_image')
  async downloadImage(
    @Query('data') data: string,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    const image = await this.qrCodeService.generateQRCodeImage(data, size);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qrcode.png"`);
    res.send(image);
  }

  @Get('download_pdf')
  async downloadPDF(
    @Query('data') data: string,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    const pdf = await this.qrCodeService.generateQRCodePDF(data, size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="qrcode.pdf"`);
    res.send(pdf);
  }
}
