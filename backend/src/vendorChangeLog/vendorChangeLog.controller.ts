import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VendorChangeLogService } from './vendorChangeLog.service';
import { VendorChangeLog } from './vendorChangeLog.model';

@Controller('vendor_change_log')
@UseGuards(JwtAuthGuard)
export class VendorChangeLogController {
  constructor(private readonly vendorChangeLogService: VendorChangeLogService) {}

  @Get('grouped')
  async getGroupedLogs(
    @Query('vendor_name') vendor_name?: string,
    @Query('phone_number') phone_number?: string,
    @Query('username') username?: string,
    @Query('operation') operation?: string,
    @Query('order_by') orderBy: string = 'created_at_group',
    @Query('order_direction') orderDirection: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.vendorChangeLogService.getGroupedLogs(
      vendor_name,
      phone_number,
      username,
      operation,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }

  
  @Get('details')
  async getLogsByCreatedAt(
    @Query('created_at') createdAt: string,
  ): Promise<any> {
    if (!createdAt) {
      throw new BadRequestException('Parameter created_at is required');
    }

    const logs = await this.vendorChangeLogService.getLogsByCreatedAt(createdAt);
    return logs;
  }
  

  @Get()
  async getAllVendors() {
    return this.vendorChangeLogService.getAllVendors();
  }


  // @Get()
  // async findAll(
  //   @Query('vendor_name') vendorName?: string, 
  //   @Query('username') userName?: string, 
  //   @Query('column_name') vendorChangeLogColumnName?: string, 
  //   @Query('value_before') value_before?: string,
  //   @Query('value_after') value_after?: string,
  //   @Query('operation') vendorChangeLogOperation?: string,
  //   @Query('order_by') orderBy?: string,
  //   @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
  //   @Query('search') search?: string,
  //   @Query('page') page: number = 1,
  //   @Query('pageSize') pageSize: number = 10,
  // // ): Promise<VendorChangeLog[]> {
  // ) {
  //   const vendorNameArray = vendorName ? vendorName.split(',') : [];
  //   const userNameArray = userName ? userName.split(',') : [];
  //   const vendorChangeLogColumnNameArray = vendorChangeLogColumnName ? vendorChangeLogColumnName.split(',') : [];
  //   const vendorChangeLogOperationArray = vendorChangeLogOperation ? vendorChangeLogOperation.split(',') : [];
  //   return this.vendorChangeLogService.findAll(
  //     vendorNameArray,
  //     userNameArray,
  //     vendorChangeLogColumnNameArray,
  //     value_before,
  //     value_after, 
  //     vendorChangeLogOperationArray,
  //     orderBy,
  //     orderDirection,
  //     search,
  //     page,
  //     pageSize,
  //   ); // Panggil logika filter
  // }

  @Get('getVendorChangeLogsColumnName')
  async getVendorChangeLogsColumnName() {
    return this.vendorChangeLogService.getVendorChangeLogsColumnName();
  }
  
  @Get('getVendorChangeLogsOperation')
  async getVendorChangeLogsOperation() {
    return this.vendorChangeLogService.getVendorChangeLogsOperation();
  }
  
  @Get('latest')
  async findLatestChangeLogs() {
    return this.vendorChangeLogService.findLatestChangeLogs();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<VendorChangeLog> {
    return this.vendorChangeLogService.findOne(id);
  }

 

  // @Post()
  // async create(@Body() vendor_change_log: VendorChangeLog): Promise<VendorChangeLog> {
  //   return this.vendorChangeLogService.create(vendor_change_log);
  // }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.vendorChangeLogService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() vendor_change_log: VendorChangeLog): Promise<VendorChangeLog> {
  //   return this.vendorChangeLogService.update(id, vendor_change_log);
  // }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
  //   await this.vendorChangeLogService.update(id, data);
  //   return { message: 'VendorChangeLog updated successfully' };
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<void> {
  //   return this.vendorChangeLogService.remove(id);
  // }
}
