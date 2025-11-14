import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order extends Document {
  @Prop({ type: [Object], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  shipping: number;

  @Prop({ required: true })
  total: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  shippingAddress: ShippingAddress;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
