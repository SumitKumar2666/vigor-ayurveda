import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'products' })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop({ type: [String], default: [] })
  benefits: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  mrp: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
