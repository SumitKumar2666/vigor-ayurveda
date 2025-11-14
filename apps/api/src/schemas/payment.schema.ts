import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true, collection: 'payments' })
export class Payment extends Document {
  @Prop({ default: 'razorpay' })
  provider: string;

  @Prop()
  rzpOrderId?: string;

  @Prop()
  rzpPaymentId?: string;

  @Prop()
  rzpSignature?: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ type: Object })
  payload?: any;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
