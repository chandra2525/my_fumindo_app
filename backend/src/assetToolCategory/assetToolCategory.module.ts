import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetToolCategoryController } from './assetToolCategory.controller';
import { AssetToolCategoryService } from './assetToolCategory.service';
import { AssetToolCategory } from './assetToolCategory.model'; 

@Module({
  imports: [SequelizeModule.forFeature([AssetToolCategory])],
  controllers: [AssetToolCategoryController],
  providers: [AssetToolCategoryService],
  exports: [AssetToolCategoryService],
})
export class AssetToolCategoryModule {}
