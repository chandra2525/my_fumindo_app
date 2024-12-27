import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Loan } from './loan.model';
import { Op } from 'sequelize';
// import * as XLSX from 'xlsx';
// import * as ExcelJS from 'exceljs';
// import { Buffer } from 'node:buffer';
import { LoanAsset } from 'src/loanAsset/loanAsset.model';
import { User } from 'src/users/users.model';
import { Asset } from 'src/asset/asset.model';
import { CreateLoanDto } from './loan.dto';


@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan) private loanModel: typeof Loan,
    @InjectModel(LoanAsset) private loanAssetModel: typeof LoanAsset
  ) {}

  async findAll(
    customer_name?: string,
    orderBy: string = 'loan_id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
    search?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ rows: Loan[]; sp: any }> {
    const whereClause: any = {};

    if (customer_name) {
      whereClause.customer_name = { [Op.iLike]: `%${customer_name}%` };
    }

    if (search) {
      whereClause[Op.or] = [
        { customer_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Pagination variables
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { rows, count } = await this.loanModel.findAndCountAll({
      where: whereClause,
      // include: [
      //   { 
      //     model: LoanAsset,
      //     include: [ // Join tabel_asset
      //       { model: Asset, attributes: ['asset_id', 'asset_name', 'category'] },
      //     ],
      //   }, // Relasi ke tabel_asset_loan
      //   { model: User, attributes: ['user_id', 'username', 'role'] }, // Relasi ke tabel_user
      // ],
      attributes: ['loan_id', 'customer_name', 'status', 'loan_date'],
      order: [[orderBy, orderDirection]],
      offset,
      limit,
    });

    const sp = {
      page,
      pageSize,
      pageCount: Math.ceil(count / pageSize),
      rowCount: count,
      start: offset,
      limit,
    };

    return { rows, sp };
  }

  async findLoanWithAssets(loan_id: number): Promise<Loan> {
    return await this.loanModel.findOne({
      where: { loan_id },
      include: [
        {
          model: LoanAsset,
          include: [ // Join tabel_asset
            { model: Asset, attributes: ['asset_id', 'asset_name', 'category'] },
          ],
        }, // Relasi ke tabel_asset_loan
        { model: User, attributes: ['user_id', 'username', 'role'] }, // Relasi ke tabel_user
      ], // Join dengan tabel_asset_loan
    });
  }

  async createLoan(createLoanDto: CreateLoanDto): Promise<Loan> {
    const { user_id, customer_name, notes, status, assets } = createLoanDto;

    const loanTable = await this.loanModel.create({
      user_id,
      customer_name,
      notes,
      status
    });

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
