import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class AdminService {
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private blogService: BlogService,
  ) {}

  async getDashboardStats() {
    const [products, categories, orders, users, blogPosts] = await Promise.all([
      this.productsService.findAll(),
      this.categoriesService.findAll(),
      this.ordersService.findAll(),
      this.usersService.findAll(),
      this.blogService.findAll(),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalBlogPosts: blogPosts.length,
      totalRevenue,
      pendingOrders,
    };
  }
}
