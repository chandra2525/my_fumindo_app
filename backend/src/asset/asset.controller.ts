import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetService } from './asset.service';
import { Asset } from './asset.model'; 
import { Response } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('asset')
@UseGuards(JwtAuthGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string, 
    @Query('asset_name') asset_name?: string,
    @Query('category') assetCategory?: string,
    @Query('tool_category_name') assetToolCategory?: string, 
    @Query('tool_condition_name') assetToolCondition?: string,
    @Query('unit_name') assetUnit?: string,
    @Query('initial_stock') initial_stock?: string,
    @Query('current_stock') current_stock?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<Asset[]> {
  ) {
    const branchNameArray = branchName ? branchName.split(',') : []; // Pisahkan string menjadi array
    const assetCategoryArray = assetCategory ? assetCategory.split(',') : [];
    const assetToolCategoryArray = assetToolCategory ? assetToolCategory.split(',') : [];
    const assetToolConditionArray = assetToolCondition ? assetToolCondition.split(',') : [];
    const assetUnitArray = assetUnit ? assetUnit.split(',') : [];
    return this.assetService.findAll(
      branchNameArray,
      asset_name,
      assetCategoryArray,
      assetToolCategoryArray, 
      assetToolConditionArray,
      assetUnitArray,
      initial_stock,
      current_stock,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get('getAssetsCategory')
  async getAssetsCategory() {
    return this.assetService.getAssetsCategory();
  }  

  @Get('getAssetsName')
  async getAssetsName( 
    @Query('category') category?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<AssetUnit[]> {
  ) {
    return this.assetService.getAssetsName(
      category,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  // @Get('getAssetsToolCategory')
  // async getAssetsToolCategory() {
  //   return this.assetService.getAssetsToolCategory();
  // }

  // @Get('getAssetsToolCondition')
  // async getAssetsToolCondition() {
  //   return this.assetService.getAssetsToolCondition();
  // }

  // @Get('getAssetsUnit')
  // async getAssetsUnit() {
  //   return this.assetService.getAssetsUnit();
  // }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.assetService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportAssets(
    @Res() res: Response,
   @Query('branch_name') branchName?: string, 
    @Query('asset_name') asset_name?: string,
    @Query('category') assetCategory?: string,
    @Query('tool_category_name') assetToolCategory?: string, 
    @Query('tool_condition_name') assetToolCondition?: string,
    @Query('unit_name') assetUnit?: string,
    @Query('initial_stock') initial_stock?: string,
    @Query('current_stock') current_stock?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const branchNameArray = branchName ? branchName.split(',') : []; // Pisahkan string menjadi array
    const assetCategoryArray = assetCategory ? assetCategory.split(',') : [];
    const assetToolCategoryArray = assetToolCategory ? assetToolCategory.split(',') : [];
    const assetToolConditionArray = assetToolCondition ? assetToolCondition.split(',') : [];
    const assetUnitArray = assetUnit ? assetUnit.split(',') : [];
    const buffer = await this.assetService.exportAssets(
      branchNameArray,
      asset_name,
      assetCategoryArray,
      assetToolCategoryArray, 
      assetToolConditionArray,
      assetUnitArray,
      initial_stock,
      current_stock,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=AssetExport.xlsx');
    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Asset> {
    return this.assetService.findOne(id);
  }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.assetService.create(data); 
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.assetService.update(id, data);
    return { message: data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.assetService.remove(id);
    await this.assetService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.assetService.importAssets(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
