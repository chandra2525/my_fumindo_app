import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockService } from './stock.service';  
import { Stock } from './stock.model';
import { Response } from 'express';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async findAll(
    @Query('branch_name') branchName?: string,
    @Query('warehouse_name') warehouseName?: string,
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
    const branchNameArray = branchName ? branchName.split(',') : [];
    const warehouseNameArray = warehouseName ? warehouseName.split(',') : [];
    const consumedArray = consumeds ? consumeds.split(',') : [];
    return this.stockService.findAll(
      branchNameArray,
      warehouseNameArray,
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
  

  @Get('export')
  async exportStock(
    @Res() res: Response,
    @Query('branch_name') branchName?: string,
    @Query('warehouse_name') warehouseName?: string,
    @Query('stock_quantity') stock_quantity?: string,
    @Query('consumed') consumed?: string,
    @Query('sku_item_name') sku_item_name?: string,
    @Query('brand') brand?: string,
    @Query('length') length?: string,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('weight') weight?: string,
    // @Query('price') price?: string,
    @Query('order_by') orderBy?: string,
    @Query('order_direction') orderDirection?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    // Pisahkan string menjadi array
    const branchNameArray = branchName ? branchName.split(',') : [];
    const warehouseNameArray = warehouseName ? warehouseName.split(',') : [];
    const consumedArray = consumed ? consumed.split(',') : [];
    const buffer = await this.stockService.exportStock(
      branchNameArray,
      warehouseNameArray,
      stock_quantity,
      consumedArray,
      sku_item_name,
      brand,
      length,
      width,
      height,
      weight,
      // price, 
      orderBy,
      orderDirection,
      search,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=StockExport.xlsx');
    res.send(buffer);
  }


  @Post()
  async addOrUpdateStock(
    @Body('purchase_inbound_id') purchaseInboundId: number,
    @Body('sku_item_id') skuItemId: number,
    @Body('branch_id') branchId: number,
    @Body('warehouse_id') warehouseId: number,
    @Body('stock_quantity') stockQuantity: number,
    @Body('quantity_before') quantityBefore: number,
    @Body('type_submit') typeSubmit: string,
  ): Promise<{ message: string }> {
    return this.stockService.addOrUpdateStock(purchaseInboundId, skuItemId, branchId, warehouseId, stockQuantity, quantityBefore, typeSubmit);
  }

  @Delete()
  async remove(
    @Body('sku_item_id') skuItemId: number,
    @Body('warehouse_id') warehouseId: number,
  ): Promise<{ message: string }> { 
    return this.stockService.remove(skuItemId, warehouseId);
  }
  
  @Put('update-batch')
  async updateBatchStock(@Body() updateDto: any) {
    return await this.stockService.updateBatchStock(updateDto);
  }
}
