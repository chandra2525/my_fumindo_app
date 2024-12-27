import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model';
import { VendorChangeLog } from '../vendorChangeLog/vendorChangeLog.model';

@Module({
  imports: [SequelizeModule.forFeature([Vendor, VendorChangeLog])],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
