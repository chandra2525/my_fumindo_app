import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanAssetController } from './loanAsset.controller';
import { LoanAssetService } from './loanAsset.service';
import { LoanAsset } from './loanAsset.model';

@Module({
  imports: [SequelizeModule.forFeature([LoanAsset])],
  controllers: [LoanAssetController],
  providers: [LoanAssetService],
  exports: [LoanAssetService],
})
export class LoanAssetModule {}
