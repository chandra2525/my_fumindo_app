import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './users.model';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(
    @Query('fullname') employeeName?: string, 
    @Query('username') username?: string, 
    @Query('role') userRole?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<User[]> { 
  ) {
    const userRoleArray = userRole ? userRole.split(',') : [];
    return this.userService.findAll(
      employeeName,
      username,
      userRoleArray,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }

  @Get('getUsersRole')
  async getUsersRole() {
    return this.userService.getUsersRole();
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.userService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=UserTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportEmployees(
    @Res() res: Response,
    @Query('fullname') employeeName?: string, 
    @Query('username') username?: string, 
    @Query('role') userRole?: string, 
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const userRoleArray = userRole ? userRole.split(',') : [];
    const buffer = await this.userService.exportUsers(
      employeeName,
      username,
      userRoleArray,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=UserExport.xlsx');
    res.send(buffer);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // @Post()
  // async create(@Body() user: User): Promise<User> {
  //   return this.userService.create(user);
  // }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.userService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() user: User): Promise<User> {
  //   return this.userService.update(id, user);
  // }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.userService.update(id, data);
    return { message: 'User updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('mass-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.userService.importUsers(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
