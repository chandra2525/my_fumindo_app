import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorService } from './vendor.service';
import { Vendor } from './vendor.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vendor')
@UseGuards(JwtAuthGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  async findAll( 
    @Query('vendor_name') vendor_name?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('upcoming_review_date') upcoming_review_date?: string,
    @Query('vendor_remark') vendor_remark?: string,
    @Query('vendor_status') vendor_status?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.vendorService.findAll(
      vendor_name,
      phone_number,
      email,
      address,
      upcoming_review_date,
      vendor_remark,
      vendor_status,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }
   
  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.vendorService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=VendorTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssetVendors(
    @Res() res: Response,
    @Query('vendor_name') vendor_name?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('upcoming_review_date') upcoming_review_date?: string,
    @Query('vendor_remark') vendor_remark?: string,
    @Query('vendor_status') vendor_status?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const buffer = await this.vendorService.exportVendors(
      vendor_name,
      phone_number,
      email,
      address,
      upcoming_review_date,
      vendor_remark,
      vendor_status,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=VendorExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Vendor> {
    return this.vendorService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.vendorService.create(data); 
    return { message: data };
  }

  // @Post()
  // async createVendor(
  //   @Body('user_id') userId: number,
  //   @Body() vendorData: Partial<Vendor>,
  // ) {
  //   return this.vendorService.createVendor(userId, vendorData);
  // }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.vendorService.update(id, data);
    return { message: data };
  }

  // @Put(':id')
  // async updateVendor(
  //   @Param('id') vendorId: number,
  //   @Body('user_id') userId: number,
  //   @Body() updatedData: Partial<Vendor>,
  // ) {
  //   return this.vendorService.updateVendor(userId, vendorId, updatedData);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.vendorService.remove(id);
    await this.vendorService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  // @Delete(':id')
  // async deleteVendor(
  //   @Param('id') vendorId: number,
  //   @Body('user_id') userId: number,
  // ) {
  //   return this.vendorService.deleteVendor(userId, vendorId);
  // }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.vendorService.importVendors(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
