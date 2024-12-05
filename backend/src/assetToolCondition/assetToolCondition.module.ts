import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetToolConditionController } from './assetToolCondition.controller';
import { AssetToolConditionService } from './assetToolCondition.service';
import { AssetToolCondition } from './assetToolCondition.model'; 

@Module({
  imports: [SequelizeModule.forFeature([AssetToolCondition])],
  controllers: [AssetToolConditionController],
  providers: [AssetToolConditionService],
  exports: [AssetToolConditionService],
})
export class AssetToolConditionModule {}
