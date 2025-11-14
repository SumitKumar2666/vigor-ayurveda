import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentStatus } from '../../schemas/payment.schema';
import { Order, OrderStatus } from '../../schemas/order.schema';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createRazorpayOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!order) throw new BadRequestException('Order not found');

    const rzpOrderId = `rzp_order_${Date.now()}`;

    const payment = new this.paymentModel({
      orderId: order._id,
      provider: 'razorpay',
      rzpOrderId,
      status: PaymentStatus.PENDING,
    });
    await payment.save();

    return {
      order_id: rzpOrderId,
      amount: order.total,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyRazorpayPayment(dto: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    const payment = await this.paymentModel.findOne({ rzpOrderId: razorpay_order_id }).exec();

    if (!payment) throw new BadRequestException('Payment not found');

    payment.rzpPaymentId = razorpay_payment_id;
    payment.rzpSignature = razorpay_signature;
    payment.status = PaymentStatus.SUCCESS;
    await payment.save();

    await this.orderModel.findByIdAndUpdate(payment.orderId, {
      status: OrderStatus.PROCESSING,
    }).exec();

    return { success: true, paymentId: payment._id };
  }
}