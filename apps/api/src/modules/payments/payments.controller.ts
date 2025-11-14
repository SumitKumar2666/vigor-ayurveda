import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('razorpay/order')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body('orderId') orderId: string, @Req() req: Request) {
    return this.paymentsService.createRazorpayOrder(orderId, req.user['_id']);
  }

  @Post('razorpay/verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() dto: any) {
    return this.paymentsService.verifyRazorpayPayment(dto);
  }
}