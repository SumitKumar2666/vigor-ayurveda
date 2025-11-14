import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  findMyOrders(@Req() req: Request) {
    return this.ordersService.findUserOrders(req.user['_id']);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const isAdmin = req.user['role'] === UserRole.ADMIN;
    return this.ordersService.findOne(id, req.user['_id'], isAdmin);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create({
      ...createOrderDto,
      userId: req.user['_id'],
    });
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
