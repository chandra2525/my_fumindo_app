import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; 
// import { Op } from 'sequelize';
// import * as XLSX from 'xlsx';
// import * as ExcelJS from 'exceljs';
// import { Buffer } from 'node:buffer';
import { LoanAsset } from 'src/loanAsset/loanAsset.model'; 


@Injectable()
export class LoanAssetService {
  constructor( 
    @InjectModel(LoanAsset) private loanAssetModel: typeof LoanAsset
  ) {}

 
}
