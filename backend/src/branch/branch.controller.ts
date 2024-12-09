import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchService } from './branch.service';
import { Branch } from './branch.model';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Response } from 'express';

export class TemplateQueryDto {
  // @IsOptional()
  // @IsString()
  format?: string; // Contoh opsi tambahan, misalnya format file (xls/xlsx)
}

@Controller('branch')
@UseGuards(JwtAuthGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() data: Branch) {
    return this.branchService.create(data);
  }

  // @Get()
  // findAll() {
  //   return this.branchService.findAll();
  // }
  
  // @Get()
  // async getFilter(@Query('branch_name') branchName?: string) {
  //   console.log('Received branch_name:', branchName); // Tambahkan log
  //   return this.branchService.getFilter(branchName);
  // }

  // @Get()
  // async findAll(@Query('branch_name') branchName?: string) {
  //   if (branchName) {
  //     console.log('Received branch_name:', branchName); // Debugging
  //     return this.branchService.getFilter(branchName); // Panggil logika filter
  //   }
  //   return this.branchService.findAll(); // Panggil logika untuk mengambil semua data
  // }

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string, 
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    const branchNameArray = branchName ? branchName.split(',') : []; // Pisahkan string menjadi array
    if (branchName||address||orderDirection||search||page||pageSize) {
      console.log('Received branch_name:', branchName); // Debugging
      return this.branchService.getFilter(
        branchNameArray,
        address,
        orderBy,
        orderDirection,
        search,
        page,
        pageSize
      ); // Panggil logika filter
    }  
    return this.branchService.findAll(orderBy, orderDirection); // Panggil logika untuk mengambil semua data
  }

  @Get('filterBranchName')
  async getBranchNames() {
    return this.branchService.getBranchNames();
  }
   
  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.branchService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=BranchTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportBranches(
    @Res() res: Response,
    @Query('branch_name') branchName?: string, 
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const branchNameArray = branchName ? branchName.split(',') : [];
    const buffer = await this.branchService.exportBranches(
      branchNameArray,
      address,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=BranchExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Branch) {
    return this.branchService.update(+id, data);
  }

  @Delete(':id')
  // delete(@Param('id') id: string) {
  async delete(@Param('id') id: number) {
    // return this.branchService.delete(+id);
    try {
      await this.branchService.delete(id);
      return { message: 'Branch deleted successfully' };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new HttpException(
          'Tidak dapat menghapus cabang ini karena dikaitkan dengan data lain',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'An error occurred while deleting the branch.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('import')
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: multer.memoryStorage(), // Simpan file di memori untuk diproses langsung
  //   fileFilter: (req, file, cb) => {
  //     if (!file.originalname.match(/\.(xls|xlsx)$/)) {
  //       return cb(new Error('Only Excel files are allowed!'), false);
  //     }
  //     cb(null, true);
  //   },
  // }))
  // async importBranches(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }
  //   return this.branchService.importBranches(file);
  // }
  
  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.branchService.importBranches(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

