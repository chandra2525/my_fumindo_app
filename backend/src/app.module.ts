import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BranchModule } from './branch/branch.module';
import { EmployeeModule } from './employee/employee.module';
import { AssetModule } from './asset/asset.module';
import { AssetChangeLogModule } from './assetChangeLog/assetChangeLog.module';
import { AssetToolCategoryModule } from './assetToolCategory/assetToolCategory.module';
import { AssetToolConditionModule } from './assetToolCondition/assetToolCondition.module';
import { AssetUnitModule } from './assetUnit/assetUnit.module';
import { LoanModule } from './loan/loan.module';
import { LoanAssetModule } from './loanAsset/loanAsset.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(databaseConfig),
    AuthModule,
    BranchModule,
    EmployeeModule,
    AssetModule,
    AssetChangeLogModule, 
    AssetToolCategoryModule,
    AssetToolConditionModule,
    AssetUnitModule,
    LoanModule,
    LoanAssetModule,
  ],
})
export class AppModule {}
