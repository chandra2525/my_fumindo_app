import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkuItemService } from './skuItem.service';
import { SkuItem } from './skuItem.model';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sku_item')
@UseGuards(JwtAuthGuard)
export class SkuItemController {
  constructor(private readonly skuItemService: SkuItemService) {}

  @Get()
  async findAll(
    @Query('sku_type_name') skuTypeName?: string,
    @Query('unit_name') unitName?: string,
    @Query('vendor_name') vendorName?: string,
    @Query('sku_item_name') sku_item_name?: string,
    @Query('brand') brand?: string,
    // @Query('length') length?: string,
    // @Query('width') width?: string,
    // @Query('height') height?: string,
    // @Query('weight') weight?: string,
    // @Query('price') price?: string,
    // @Query('consumed') consumed?: string,
    @Query('consumed') consumeds?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<SkuItem[]> { 
  ) {
    const skuTypeNameArray = skuTypeName ? skuTypeName.split(',') : []; // Pisahkan string menjadi array
    const unitNameArray = unitName ? unitName.split(',') : []; // Pisahkan string menjadi array
    const vendorNameArray = vendorName ? vendorName.split(',') : []; // Pisahkan string menjadi array
    const consumedArray = consumeds ? consumeds.split(',') : []; // Pisahkan string menjadi array
    return this.skuItemService.findAll(
      skuTypeNameArray,
      unitNameArray,
      vendorNameArray,
      sku_item_name,
      brand,
      // length,
      // width,
      // height,
      // weight,
      // price,
      consumedArray,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
 

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.skuItemService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SkuItemTemplate.xlsx');
    res.send(buffer);
  }


  @Get('export')
  async exportSkuItems(
    @Res() res: Response,
    @Query('sku_type_name') skuTypeName?: string, 
    @Query('unit_name') unitName?: string, 
    @Query('vendor_name') vendorName?: string, 
    @Query('sku_item_name') sku_item_name?: string,
    @Query('brand') brand?: string,
    // @Query('length') length?: string,
    // @Query('width') width?: string,
    // @Query('height') height?: string,
    // @Query('weight') weight?: string,
    // @Query('price') price?: string,
    // @Query('consumed') consumed?: string,
    @Query('consumed') consumeds?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const skuTypeNameArray = skuTypeName ? skuTypeName.split(',') : []; // Pisahkan string menjadi array
    const unitNameArray = unitName ? unitName.split(',') : []; // Pisahkan string menjadi array
    const vendorNameArray = vendorName ? vendorName.split(',') : []; // Pisahkan string menjadi array
    const consumedArray = consumeds ? consumeds.split(',') : []; // Pisahkan string menjadi array
    const buffer = await this.skuItemService.exportSkuItems(
      skuTypeNameArray,
      unitNameArray,
      vendorNameArray,
      sku_item_name,
      brand,
      // length,
      // width,
      // height,
      // weight,
      // price,
      consumedArray,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=SkuItemExport.xlsx');
    res.send(buffer);
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<SkuItem> {
    return this.skuItemService.findOne(id);
  }

 

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.skuItemService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.skuItemService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.vendorService.remove(id);
    await this.skuItemService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.skuItemService.importSkuItems(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
