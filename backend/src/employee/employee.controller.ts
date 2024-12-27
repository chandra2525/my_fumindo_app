import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string, 
    @Query('fullname') fullname?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('division') employeeDivision?: string,
    @Query('status') employeeStatus?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<Employee[]> {
  ) {
    const branchNameArray = branchName ? branchName.split(',') : []; // Pisahkan string menjadi array
    const employeeStatusArray = employeeStatus ? employeeStatus.split(',') : [];
    const employeeDivisionArray = employeeDivision ? employeeDivision.split(',') : [];
    return this.employeeService.findAll(
      branchNameArray,
      fullname,
      phone_number,
      email,
      address,
      employeeDivisionArray,
      employeeStatusArray,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
      // orderBy || 'employee_id', // Default sorting by employee_id
      // orderDirection || 'DESC', // Default descending order
    ); // Panggil logika filter
  }

  @Get('getEmployeesStatus')
  async getEmployeesStatus() {
    return this.employeeService.getEmployeesStatus();
  }

  @Get('getEmployeesDivision')
  async getEmployeesDivision() {
    return this.employeeService.getEmployeesDivision();
  }

  @Get('template')
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.employeeService.generateTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=EmployeeTemplate.xlsx');
    res.send(buffer);
  }

  @Get('export')
  async exportEmployees(
    @Res() res: Response,
    @Query('branch_name') branchName?: string, 
    @Query('fullname') fullname?: string,
    @Query('phone_number') phone_number?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('division') employeeDivision?: string,
    @Query('status') employeeStatus?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    const branchNameArray = branchName ? branchName.split(',') : [];
    const employeeStatusArray = employeeStatus ? employeeStatus.split(',') : [];
    const employeeDivisionArray = employeeDivision ? employeeDivision.split(',') : [];
    const buffer = await this.employeeService.exportEmployees(
      branchNameArray,
      fullname,
      phone_number,
      email,
      address,
      employeeDivisionArray,
      employeeStatusArray,
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=EmployeeExport.xlsx');
    res.send(buffer);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  // @Post()
  // async create(@Body() employee: Employee): Promise<Employee> {
  //   return this.employeeService.create(employee);
  // }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.employeeService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() employee: Employee): Promise<Employee> {
  //   return this.employeeService.update(id, employee);
  // }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.employeeService.update(id, data);
    return { message: 'Employee updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: number){
    // return this.employeeService.remove(id);
    try {
      await this.employeeService.remove(id);
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new HttpException(
          'Tidak dapat menghapus karyawan ini karena dikaitkan dengan data lain',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'An error occurred while deleting the employee.',
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
      return await this.employeeService.importEmployes(file);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
