import { IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem, ShippingAddress } from '../../../schemas/order.schema';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  items: OrderItem[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  shipping: number;

  @IsNumber()
  total: number;

  @IsObject()
  shippingAddress: ShippingAddress;
}
