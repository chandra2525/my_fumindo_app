import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.model';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('warehouse')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string, 
    @Query('warehouse_name') warehouse_name?: string,
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<Warehouse[]> { 
  ) {
    const branchNameArray = branchName ? branchName.split(',') : []; // Pisahkan string menjadi array
    return this.warehouseService.findAll(
      branchNameArray,
      warehouse_name,
      address,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
 

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.warehouseService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=WarehouseTemplate.xlsx');
    res.send(buffer);
  }


  @Get('export')
  async exportWarehouses(
    @Res() res: Response,
    @Query('branch_name') branchName?: string,
    @Query('warehouse_name') warehouse_name?: string,
    @Query('address') address?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const branchNameArray = branchName ? branchName.split(',') : [];
    const buffer = await this.warehouseService.exportWarehouses(
      branchNameArray,
      warehouse_name,
      address,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=WarehouseExport.xlsx');
    res.send(buffer);
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Warehouse> {
    return this.warehouseService.findOne(id);
  }

 

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.warehouseService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.warehouseService.update(id, data);
    return { message: 'Warehouse updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number){
    try {
      await this.warehouseService.remove(id);
      return { message: 'Warehouse deleted successfully, Warehouse Id: '+id };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new HttpException(
          'Tidak dapat menghapus gudang ini karena dikaitkan dengan data lain',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'An error occurred while deleting the warehouse.',
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
      return await this.warehouseService.importWarehouses(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
