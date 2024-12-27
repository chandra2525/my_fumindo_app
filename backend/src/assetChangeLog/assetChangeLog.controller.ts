import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetChangeLogService } from './assetChangeLog.service';
import { AssetChangeLog } from './assetChangeLog.model';

@Controller('asset_change_log')
@UseGuards(JwtAuthGuard)
export class AssetChangeLogController {
  constructor(private readonly assetChangeLogService: AssetChangeLogService) {}

  @Get('grouped')
  async getGroupedLogs(
    @Query('asset_name') asset_name?: string,
    @Query('category') category?: string,
    @Query('username') username?: string,
    @Query('operation') operation?: string,
    @Query('order_by') orderBy: string = 'created_at_group',
    @Query('order_direction') orderDirection: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.assetChangeLogService.getGroupedLogs(
      asset_name,
      category,
      username,
      operation,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }

  @Get()
  async findAll(
    @Query('asset_name') assetName?: string, 
    @Query('username') userName?: string, 
    @Query('column_name') assetChangeLogColumnName?: string, 
    @Query('value_before') value_before?: string,
    @Query('value_after') value_after?: string,
    @Query('operation') assetChangeLogOperation?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  // ): Promise<AssetChangeLog[]> {
  ) {
    const assetNameArray = assetName ? assetName.split(',') : [];
    const userNameArray = userName ? userName.split(',') : [];
    const assetChangeLogColumnNameArray = assetChangeLogColumnName ? assetChangeLogColumnName.split(',') : [];
    const assetChangeLogOperationArray = assetChangeLogOperation ? assetChangeLogOperation.split(',') : [];
    return this.assetChangeLogService.findAll(
      assetNameArray,
      userNameArray,
      assetChangeLogColumnNameArray,
      value_before,
      value_after, 
      assetChangeLogOperationArray,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    ); // Panggil logika filter
  }

  @Get('getAssetChangeLogsColumnName')
  async getAssetChangeLogsColumnName() {
    return this.assetChangeLogService.getAssetChangeLogsColumnName();
  }
  
  @Get('getAssetChangeLogsOperation')
  async getAssetChangeLogsOperation() {
    return this.assetChangeLogService.getAssetChangeLogsOperation();
  }
  
  @Get('latest')
  async findLatestChangeLogs() {
    return this.assetChangeLogService.findLatestChangeLogs();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AssetChangeLog> {
    return this.assetChangeLogService.findOne(id);
  }

 

  // @Post()
  // async create(@Body() asset_change_log: AssetChangeLog): Promise<AssetChangeLog> {
  //   return this.assetChangeLogService.create(asset_change_log);
  // }

  @Post()
  async create(@Body() data: any): Promise<{ message: string }> {
    await this.assetChangeLogService.create(data);
    // return { message: 'Staff created successfully' };
    return { message: data };
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() asset_change_log: AssetChangeLog): Promise<AssetChangeLog> {
  //   return this.assetChangeLogService.update(id, asset_change_log);
  // }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
  //   await this.assetChangeLogService.update(id, data);
  //   return { message: 'AssetChangeLog updated successfully' };
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<void> {
  //   return this.assetChangeLogService.remove(id);
  // }
}
