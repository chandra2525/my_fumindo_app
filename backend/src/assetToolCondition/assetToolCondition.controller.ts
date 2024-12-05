import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetToolConditionService } from './assetToolCondition.service';
import { AssetToolCondition } from './assetToolCondition.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('asset_tool_condition')
@UseGuards(JwtAuthGuard)
export class AssetToolConditionController {
  constructor(private readonly assetToolConditionService: AssetToolConditionService) {}

  @Get()
  async findAll( 
    @Query('tool_condition_name') tool_condition_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<AssetToolCondition[]> {
  ) {
    return this.assetToolConditionService.findAll(
      tool_condition_name,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.assetToolConditionService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetToolConditionTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssetToolConditions(
    @Res() res: Response,
    @Query('tool_condition_name') tool_condition_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const buffer = await this.assetToolConditionService.exportAssetToolConditions(
      tool_condition_name,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetToolConditionExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AssetToolCondition> {
    return this.assetToolConditionService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.assetToolConditionService.create(data); 
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.assetToolConditionService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.assetToolConditionService.remove(id);
    await this.assetToolConditionService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.assetToolConditionService.importAssetToolConditions(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
