import { IsString, IsNotEmpty, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  author?: string;
}
