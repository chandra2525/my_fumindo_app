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

  @Post()
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loanService.createLoan(createLoanDto);
  }
 
}

