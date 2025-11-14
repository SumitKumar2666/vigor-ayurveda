import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { BlogService } from '../blog/blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private blogService: BlogService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // Product Management
  @Post('products')
  createProduct(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Put('products/:slug')
  updateProduct(@Param('slug') slug: string, @Body() updateProductDto: any) {
    return this.productsService.update(slug, updateProductDto);
  }

  @Delete('products/:slug')
  deleteProduct(@Param('slug') slug: string) {
    return this.productsService.delete(slug);
  }

  // Order Management
  @Get('orders')
  getAllOrders() {
    return this.ordersService.findAll();
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.ordersService.updateStatus(id, status);
  }

  // User Management
  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
