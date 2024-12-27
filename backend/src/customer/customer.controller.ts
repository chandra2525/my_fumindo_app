import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll( 
    @Query('customer_name') customer_name?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<Customer[]> {
  ) {
    return this.customerService.findAll(
      customer_name,
      phone_number,
      email,
      address,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }
   
  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.customerService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=CustomerTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssetCustomers(
    @Res() res: Response,
    @Query('customer_name') customer_name?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const buffer = await this.customerService.exportAssetCustomers(
      customer_name,
      phone_number,
      email,
      address,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=CustomerExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Customer> {
    return this.customerService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.customerService.create(data); 
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.customerService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.customerService.remove(id);
    await this.customerService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.customerService.importAssetCustomers(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
