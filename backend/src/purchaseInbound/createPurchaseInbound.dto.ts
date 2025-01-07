import { IsArray, IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreatePurchaseInboundDto {
  @IsInt()
  warehouse_id: number;

  @IsInt()
  vendor_id: number;

  @IsInt()
  user_id: number;

  @IsArray()
  @IsInt({ each: true })
  sku_item_id: number[];

  @IsArray()
  @IsInt({ each: true })
  price: number[];

  @IsArray()
  // @IsInt({ each: true })
  expected_quantity: number[];

  @IsString()
  inventory_type: string;

  @IsString()
  purchase_order_number: string;

  @IsDateString()
  expected_inbound_date: string;

  @IsString()
  asn: string;

  @IsString()
  status: string;
}
