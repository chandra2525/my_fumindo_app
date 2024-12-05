import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetChangeLogController } from './assetChangeLog.controller';
import { AssetChangeLogService } from './assetChangeLog.service';
import { AssetChangeLog } from './assetChangeLog.model';
import { Asset } from '../asset/asset.model'; 
import { User } from '../users/users.model'; 

@Module({
  imports: [SequelizeModule.forFeature([AssetChangeLog, Asset, User])],
  controllers: [AssetChangeLogController],
  providers: [AssetChangeLogService],
  exports: [AssetChangeLogService],
})
export class AssetChangeLogModule {}
