import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderStatus } from '../../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll() {
    return this.orderModel.find().populate('userId').sort({ createdAt: -1 }).exec();
  }

  async findUserOrders(userId: string) {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId?: string, isAdmin: boolean = false) {
    const order = await this.orderModel.findById(id).populate('userId').exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user has permission to view this order
    if (!isAdmin && userId && order.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  async create(orderData: Partial<Order>) {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async delete(id: string) {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Order not found');
    }
    return { message: 'Order deleted successfully' };
  }
}
