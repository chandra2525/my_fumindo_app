import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PurchaseInboundService } from './purchaseInbound.service';
import { CreatePurchaseInboundDto } from './createPurchaseInbound.dto';
import { PurchaseInbound } from './purchaseInbound.model';

@Controller('purchase_inbound')
@UseGuards(JwtAuthGuard)
export class PurchaseInboundController {
  constructor(private readonly purchaseInboundService: PurchaseInboundService) {}

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string,
    @Query('warehouse_name') warehouseName?: string,
    @Query('inventory_type') inventoryType?: string,
    @Query('vendor_name') vendorName?: string,
    @Query('status') status?: string,
    @Query('purchase_order_number') purchase_order_number?: string,
    @Query('username') username?: string,
    @Query('expected_inbound_date') expected_inbound_date?: string,
    @Query('asn') asn?: string,
    @Query('create_date') create_date?: Date,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    // Pisahkan string menjadi array
    const branchNameArray = branchName ? branchName.split(',') : []; 
    const warehouseNameArray = warehouseName ? warehouseName.split(',') : []; 
    const inventoryTypeArray = inventoryType ? inventoryType.split(',') : [];
    const vendorNameArray = vendorName ? vendorName.split(',') : [];
    const statusArray = status ? status.split(',') : [];
    return this.purchaseInboundService.findAll(
      branchNameArray,
      warehouseNameArray,
      inventoryTypeArray,
      vendorNameArray,
      statusArray,
      purchase_order_number,
      username,
      expected_inbound_date,
      asn,
      create_date,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PurchaseInbound> {
    return this.purchaseInboundService.findOne(id);
  }

  @Post()
  async create(@Body() createPurchaseInboundDto: CreatePurchaseInboundDto) {
    return await this.purchaseInboundService.create(createPurchaseInboundDto);
  }

  @Put('updateStatus/:id')
  async updateStatus(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.purchaseInboundService.updateStatus(id, data);
    return { message: data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() createPurchaseInboundDto: CreatePurchaseInboundDto): Promise<{ message: string }> {
    // await this.purchaseInboundService.update(id, data);
    // return { message: data };
    await this.purchaseInboundService.update(id, createPurchaseInboundDto);
    return { message: 'Purchase Inbound updated successfully' };
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
  //   await this.purchaseInboundService.update(id, data);
  //   return { message: data };
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.purchaseInboundService.remove(id);
    await this.purchaseInboundService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }
}
