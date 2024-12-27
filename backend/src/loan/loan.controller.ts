import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoanService } from './loan.service';
import { Loan } from './loan.model';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Response } from 'express';
import { CreateLoanDto } from './loan.dto';

export class TemplateQueryDto {
  // @IsOptional()
  // @IsString()
  format?: string; // Contoh opsi tambahan, misalnya format file (xls/xlsx)
}

@Controller('loan')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get()
  async findAll(
    @Query('customer_name') customer_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.loanService.findAll(
      customer_name,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get(':loan_id')
  async getLoanWithAssets(@Param('loan_id') loan_id: number) {
    const loan = await this.loanService.findLoanWithAssets(loan_id);
    if (!loan) {
      return { message: `Loan with id ${loan_id} not found` };
    }
    return loan;
  }

  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loanService.createLoan(createLoanDto);
  }

}
