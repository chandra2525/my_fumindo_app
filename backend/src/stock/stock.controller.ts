import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockService } from './stock.service';  
import { Stock } from './stock.model';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async findAll(
    @Query('warehouse_name') warehouseNames?: string,
    @Query('stock_quantity') stock_quantity?: string,
    @Query('consumed') consumeds?: string,
    @Query('sku_item_name') sku_item_name?: string,
    @Query('brand') brand?: string,
    @Query('length') length?: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('weight') weight?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    // Pisahkan string menjadi array
    const warehouseArray = warehouseNames ? warehouseNames.split(',') : [];
    const consumedArray = consumeds ? consumeds.split(',') : [];
    return this.stockService.findAll(
      warehouseArray,
      stock_quantity,
      consumedArray,
      sku_item_name,
      brand,
      length,
      width,
      height,
      weight,
      orderBy,
      orderDirection,
      search,
      page,
      pageSize,
    );
  }
  

  @Post()
  async addOrUpdateStock(
    @Body('sku_item_id') skuItemId: number,
    @Body('warehouse_id') warehouseId: number,
    @Body('stock_quantity') stockQuantity: number,
    @Body('quantity_before') quantityBefore: number,
    @Body('type_submit') typeSubmit: string,
  ): Promise<{ message: string }> {
    return this.stockService.addOrUpdateStock(skuItemId, warehouseId, stockQuantity, quantityBefore, typeSubmit);
  }

  @Delete()
  async remove(
    @Body('sku_item_id') skuItemId: number,
    @Body('warehouse_id') warehouseId: number,
  ): Promise<{ message: string }> { 
    return this.stockService.remove(skuItemId, warehouseId);
  }
  
}
