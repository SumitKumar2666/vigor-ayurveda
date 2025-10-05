import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, categorySlug?: string) {
    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) where.categoryId = category.id;
    }

    return this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}