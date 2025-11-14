import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../../schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(slug: string) {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(categoryData: Partial<Category>) {
    const existing = await this.categoryModel.findOne({ slug: categoryData.slug }).exec();
    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }
    const category = new this.categoryModel(categoryData);
    return category.save();
  }

  async update(slug: string, updateData: Partial<Category>) {
    const category = await this.categoryModel
      .findOneAndUpdate({ slug }, updateData, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async delete(slug: string) {
    const result = await this.categoryModel.findOneAndDelete({ slug }).exec();
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
