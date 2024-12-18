import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoanAssetService } from './loanAsset.service'; 

 

@Controller('loan')
@UseGuards(JwtAuthGuard)
export class LoanAssetController {
  constructor(private readonly loanAssetService: LoanAssetService) {}

   
 
}

