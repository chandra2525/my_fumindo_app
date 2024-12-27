import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body, Query, Res, UseInterceptors, UploadedFile, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('hierarchy')
  async getRecursiveHierarchy(
    @Query('category_name') category_name?: string,
    // @Query('level') level?: number, 
    @Query('level') levels?: string, 
    @Query('path') path?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const levelArray = levels ? levels.split(',') : []; // Pisahkan string menjadi array
    return this.categoryService.getRecursiveHierarchy(
      category_name,
      // level,
      levelArray,
      path,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
  
  @Get('filterLevel')
  async getLevels() {
    return this.categoryService.getLevels();
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.categoryService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=CategoryTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportCategory(
    @Res() res: Response,
    @Query('category_name') category_name?: string,
    @Query('level') levels?: string,  // Menyesuaikan dengan array levels
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const levelArray = levels ? levels.split(',') : []; //
    const buffer = await this.categoryService.exportCategory(
      category_name,
      levelArray, 
      orderBy,
      orderDirection,
      search,
    );
   
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=CategoryExport.xlsx');
    res.send(buffer);
  }
  
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.categoryService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.categoryService.update(id, data);
  }
 
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.categoryService.delete(id);
    return { message: 'Id berhasil dihapus : '+id };
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.categoryService.importCategories(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
