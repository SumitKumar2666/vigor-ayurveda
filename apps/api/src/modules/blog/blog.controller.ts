import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  findAll(@Query('published') published?: string) {
    const isPublished = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.blogService.findAll(isPublished);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('slug') slug: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(slug, updateBlogPostDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  delete(@Param('slug') slug: string) {
    return this.blogService.delete(slug);
  }
}
