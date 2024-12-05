import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from './asset.model';
import { Branch } from '../branch/branch.model';
import { User } from '../users/users.model'; 
import { AssetChangeLog } from '../assetChangeLog/assetChangeLog.model';
import { AssetToolCategory } from '../assetToolCategory/assetToolCategory.model';
import { AssetToolCondition } from '../assetToolCondition/assetToolCondition.model';
import { AssetUnit } from '../assetUnit/assetUnit.model';


@Module({
  imports: [SequelizeModule.forFeature([Asset, Branch, User, AssetChangeLog, AssetToolCategory, AssetToolCondition, AssetUnit])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
