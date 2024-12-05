import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetUnitController } from './assetUnit.controller';
import { AssetUnitService } from './assetUnit.service';
import { AssetUnit } from './assetUnit.model'; 

@Module({
  imports: [SequelizeModule.forFeature([AssetUnit])],
  controllers: [AssetUnitController],
  providers: [AssetUnitService],
  exports: [AssetUnitService],
})
export class AssetUnitModule {}
