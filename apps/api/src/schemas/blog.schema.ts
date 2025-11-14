import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'blog_posts' })
export class BlogPost extends Document {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  excerpt: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  published: boolean;

  @Prop()
  coverImage?: string;

  @Prop()
  author?: string;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
