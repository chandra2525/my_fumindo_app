import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PurchaseInboundItemService } from './purchaseInboundItem.service';  
import { PurchaseInboundItem } from './purchaseInboundItem.model';

@Controller('purchase_inbound_item')
@UseGuards(JwtAuthGuard)
export class PurchaseInboundItemController {
  constructor(private readonly purchaseInboundItemService: PurchaseInboundItemService) {}

  @Get()
  async findAll(
    @Query('purchase_inbound_id') purchase_inbound_id?: string,
    @Query('consumed') consumeds?: string,
    @Query('sku_item_name') sku_item_name?: string,
    @Query('brand') brand?: string,
    @Query('length') length?: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('weight') weight?: string,
    @Query('price') price?: string,
    @Query('expected_quantity') expected_quantity?: string,
    @Query('actual_quantity') actual_quantity?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    // Pisahkan string menjadi array
    const consumedArray = consumeds ? consumeds.split(',') : []; 
    return this.purchaseInboundItemService.findAll(
      purchase_inbound_id,
      consumedArray,
      sku_item_name,
      brand,
      length,
      width,
      height,
      weight,
      price,
      expected_quantity,
      actual_quantity,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PurchaseInboundItem> {
    return this.purchaseInboundItemService.findOne(id);
  }


  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any): Promise<{ message: string }> {
    await this.purchaseInboundItemService.updateActualQuantity(id, data);
    return { message: data };
  }


  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    // return this.purchaseInboundItemService.remove(id);
    await this.purchaseInboundItemService.remove(id);
    return { message: 'Id berhasil dihapus : '+id };
  }
}
