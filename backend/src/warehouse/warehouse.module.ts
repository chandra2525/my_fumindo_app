import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.model';
import { Branch } from '../branch/branch.model';


@Module({
  imports: [SequelizeModule.forFeature([Warehouse, Branch])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
