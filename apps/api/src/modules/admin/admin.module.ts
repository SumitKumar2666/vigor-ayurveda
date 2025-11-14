import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { BlogModule } from '../blog/blog.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdersModule, UsersModule, BlogModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
