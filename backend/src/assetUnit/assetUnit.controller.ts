import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetUnitService } from './assetUnit.service';
import { AssetUnit } from './assetUnit.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('asset_unit')
@UseGuards(JwtAuthGuard)
export class AssetUnitController {
  constructor(private readonly assetUnitService: AssetUnitService) {}

  @Get()
  async findAll( 
    @Query('unit_name') unit_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<AssetUnit[]> {
  ) {
    return this.assetUnitService.findAll(
      unit_name,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.assetUnitService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetUnitTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssetUnits(
    @Res() res: Response,
    @Query('unit_name') unit_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const buffer = await this.assetUnitService.exportAssetUnits(
      unit_name,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetUnitExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AssetUnit> {
    return this.assetUnitService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.assetUnitService.create(data); 
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.assetUnitService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.assetUnitService.remove(id);
    await this.assetUnitService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.assetUnitService.importAssetUnits(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
