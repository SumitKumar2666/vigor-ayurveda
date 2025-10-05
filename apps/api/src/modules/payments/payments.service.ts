import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createRazorpayOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) throw new BadRequestException('Order not found');

    const rzpOrderId = `rzp_order_${Date.now()}`;

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'razorpay',
        rzpOrderId,
        status: 'PENDING',
      },
    });

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

    const payment = await this.prisma.payment.findFirst({
      where: { rzpOrderId: razorpay_order_id },
    });

    if (!payment) throw new BadRequestException('Payment not found');

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        rzpPaymentId: razorpay_payment_id,
        rzpSignature: razorpay_signature,
        status: 'SUCCESS',
      },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PROCESSING' },
    });

    return { success: true, paymentId: payment.id };
  }
}