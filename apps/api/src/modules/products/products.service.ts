import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../schemas/product.schema';
import { Category } from '../../schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll(search?: string, categorySlug?: string) {
    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categorySlug) {
      const category = await this.categoryModel.findOne({ slug: categorySlug }).exec();
      if (category) {
        filter.categoryId = category._id;
      }
    }

    return this.productModel
      .find(filter)
      .populate('categoryId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(slug: string) {
    const product = await this.productModel
      .findOne({ slug })
      .populate('categoryId')
      .exec();

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(productData: Partial<Product>) {
    const product = new this.productModel(productData);
    return product.save();
  }

  async update(slug: string, updateData: Partial<Product>) {
    const product = await this.productModel
      .findOneAndUpdate({ slug }, updateData, { new: true })
      .populate('categoryId')
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async delete(slug: string) {
    const result = await this.productModel.findOneAndDelete({ slug }).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }
}