import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './loan.model';
import { LoanAsset } from 'src/loanAsset/loanAsset.model';


@Module({
  imports: [SequelizeModule.forFeature([Loan, LoanAsset])],
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}
