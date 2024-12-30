import { Controller, Post, Body } from '@nestjs/common';
import { PurchaseInboundService } from './purchaseInbound.service';
import { CreatePurchaseInboundDto } from './createPurchaseInbound.dto';

@Controller('purchase_inbound')
export class PurchaseInboundController {
  constructor(private readonly purchaseInboundService: PurchaseInboundService) {}

  @Post()
  async create(@Body() createPurchaseInboundDto: CreatePurchaseInboundDto) {
    return await this.purchaseInboundService.createPurchaseInbound(createPurchaseInboundDto);
  }
}
