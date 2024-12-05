import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetToolCategoryService } from './assetToolCategory.service';
import { AssetToolCategory } from './assetToolCategory.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('asset_tool_category')
@UseGuards(JwtAuthGuard)
export class AssetToolCategoryController {
  constructor(private readonly assetToolCategoryService: AssetToolCategoryService) {}

  @Get()
  async findAll( 
    @Query('tool_category_name') tool_category_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<AssetToolCategory[]> {
  ) {
    return this.assetToolCategoryService.findAll(
      tool_category_name,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.assetToolCategoryService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetToolCategoryTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssetToolCategories(
    @Res() res: Response,
    @Query('tool_category_name') tool_category_name?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const buffer = await this.assetToolCategoryService.exportAssetToolCategories(
      tool_category_name,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetToolCategoryExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AssetToolCategory> {
    return this.assetToolCategoryService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.assetToolCategoryService.create(data); 
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.assetToolCategoryService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.assetToolCategoryService.remove(id);
    await this.assetToolCategoryService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.assetToolCategoryService.importAssetToolCategories(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
