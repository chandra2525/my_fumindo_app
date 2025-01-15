import { Module } from '@nestjs/common'; 
import { QRCodeController } from './qrCode.controller';
import { QRCodeService } from './qrCode.service';

@Module({
  controllers: [QRCodeController],
  providers: [QRCodeService],
  exports: [QRCodeService],
})
export class QRCodeModule {}
