import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorChangeLogController } from './vendorChangeLog.controller';
import { VendorChangeLogService } from './vendorChangeLog.service';
import { VendorChangeLog } from './vendorChangeLog.model';
import { Vendor } from '../vendor/vendor.model'; 
import { User } from '../users/users.model'; 

@Module({
  imports: [SequelizeModule.forFeature([VendorChangeLog, Vendor, User])],
  controllers: [VendorChangeLogController],
  providers: [VendorChangeLogService],
  exports: [VendorChangeLogService],
})
export class VendorChangeLogModule {}
