import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from '../../schemas/blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>) {}

  async findAll(published?: boolean) {
    const filter: any = {};
    if (published !== undefined) {
      filter.published = published;
    }
    return this.blogPostModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(slug: string) {
    const post = await this.blogPostModel.findOne({ slug }).exec();
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async create(postData: Partial<BlogPost>) {
    const existing = await this.blogPostModel.findOne({ slug: postData.slug }).exec();
    if (existing) {
      throw new ConflictException('Blog post with this slug already exists');
    }
    const post = new this.blogPostModel(postData);
    return post.save();
  }

  async update(slug: string, updateData: Partial<BlogPost>) {
    const post = await this.blogPostModel
      .findOneAndUpdate({ slug }, updateData, { new: true })
      .exec();
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async delete(slug: string) {
    const result = await this.blogPostModel.findOneAndDelete({ slug }).exec();
    if (!result) {
      throw new NotFoundException('Blog post not found');
    }
    return { message: 'Blog post deleted successfully' };
  }
}
