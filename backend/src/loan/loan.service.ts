import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './loan.model';
// import { Op } from 'sequelize';
// import * as XLSX from 'xlsx';
// import * as ExcelJS from 'exceljs';
// import { Buffer } from 'node:buffer';
import { LoanAsset } from 'src/loanAsset/loanAsset.model';
import { CreateLoanDto } from './loan.dto';


@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan, 
    @InjectModel(LoanAsset) private loanAssetModel: typeof LoanAsset
  ) {}

  // async create(data): Promise<Loan> {
  //   return await this.loanModel.create(data);
  // }

  async createLoan(createLoanDto: CreateLoanDto): Promise<Loan> {
    const { user_id, customer_name, notes, assets } = createLoanDto;

    const loanTable = await this.loanModel.create({
      user_id,
      customer_name,
      notes,  
    });
 
    // const asset = await this.loanModel.findByPk(loanTable.loan_id);
    // if (!asset) {
    //   throw new NotFoundException('Asset not found');
    // }

    if (assets && assets.length > 0) {
      const assetEntries = assets.map((asset) => ({
        loan_id: loanTable.loan_id,
        asset_id: asset.asset_id,
        input_method: asset.input_method,
        quantity: asset.quantity,
      }));

      await this.loanAssetModel.bulkCreate(assetEntries);
    }

    return this.loanModel.findOne({
      where: { loan_id: loanTable.loan_id },
      include: [LoanAsset],
    });
  }

  

  
}
