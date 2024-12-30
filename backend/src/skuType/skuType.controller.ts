import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkuTypeService } from './skuType.service';
import { SkuType } from './skuType.model';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sku_type')
@UseGuards(JwtAuthGuard)
export class SkuTypeController {
  constructor(private readonly skuTypeService: SkuTypeService) {}

  @Get()
  async findAll(
    @Query('category_name') categoryName?: string, 
    @Query('sku_type_name') sku_type_name?: string,
    @Query('sku_type_code') sku_type_code?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<SkuType[]> { 
  ) {
    const categoryNameArray = categoryName ? categoryName.split(',') : []; // Pisahkan string menjadi array
    return this.skuTypeService.findAll(
      categoryNameArray,
      sku_type_name,
      sku_type_code,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
 

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.skuTypeService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SkuTypeTemplate.xlsx');
    res.send(buffer);
  }


  @Get('export')
  async exportSkuTypes(
    @Res() res: Response,
    @Query('category_name') categoryName?: string,
    @Query('sku_type_name') sku_type_name?: string,
    @Query('sku_type_code') sku_type_code?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const categoryNameArray = categoryName ? categoryName.split(',') : [];
    const buffer = await this.skuTypeService.exportSkuTypes(
      categoryNameArray,
      sku_type_name,
      sku_type_code,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SkuTypeExport.xlsx');
    res.send(buffer);
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SkuType> {
    return this.skuTypeService.findOne(id);
  }

 

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.skuTypeService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.skuTypeService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number){
    try {
      await this.skuTypeService.remove(id);
      return { message: 'SKU Type deleted successfully, Id SKU Type: '+id };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new HttpException(
          'Tidak dapat menghapus Jenis SKU ini karena dikaitkan dengan data lain',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'An error occurred while deleting the SKU type.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.skuTypeService.importSkuTypes(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
