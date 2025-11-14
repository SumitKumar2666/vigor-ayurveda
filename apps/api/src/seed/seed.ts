import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserRole } from '../schemas/user.schema';
import { Category } from '../schemas/category.schema';
import { Product } from '../schemas/product.schema';
import { BlogPost } from '../schemas/blog.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get models
  const userModel = app.get<Model<User>>('UserModel');
  const categoryModel = app.get<Model<Category>>('CategoryModel');
  const productModel = app.get<Model<Product>>('ProductModel');
  const blogPostModel = app.get<Model<BlogPost>>('BlogPostModel');

  console.log('Starting database seed...');

  // Clear existing data
  await Promise.all([
    userModel.deleteMany({}),
    categoryModel.deleteMany({}),
    productModel.deleteMany({}),
    blogPostModel.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Create admin user
  const adminHash = await argon2.hash('Admin@123!ChangeMe');
  const adminUser = await userModel.create({
    email: 'admin@vigorayurveda.com',
    name: 'Admin User',
    hash: adminHash,
    role: UserRole.ADMIN,
  });
  console.log('Created admin user');

  // Create test user
  const userHash = await argon2.hash('Test@123!');
  const testUser = await userModel.create({
    email: 'user@test.com',
    name: 'Test User',
    hash: userHash,
    role: UserRole.USER,
  });
  console.log('Created test user');

  // Create categories
  const categories = await categoryModel.insertMany([
    {
      name: 'Sexual Wellness',
      slug: 'sexual-wellness',
      description: 'Natural solutions for vitality and performance',
    },
    {
      name: 'Hormonal Balance',
      slug: 'hormonal-balance',
      description: 'Support your endocrine system naturally',
    },
    {
      name: 'Digestive Health',
      slug: 'digestive-health',
      description: 'Optimize gut health and digestion',
    },
    {
      name: 'Foundation Stacks',
      slug: 'foundation-stacks',
      description: 'Complete wellness bundles',
    },
  ]);
  console.log('Created categories');

  // Create products
  const products = await productModel.insertMany([
    {
      slug: 'ashwagandha-ksm66',
      title: 'Ashwagandha KSM-66',
      description:
        'Premium Ashwagandha extract for stress relief, energy, and hormonal balance. KSM-66 is the highest concentration full-spectrum extract.',
      ingredients: ['KSM-66 Ashwagandha Extract (600mg)', 'Organic Black Pepper Extract (5mg)'],
      benefits: [
        'Reduces stress and anxiety',
        'Boosts testosterone naturally',
        'Improves sleep quality',
        'Enhances athletic performance',
      ],
      price: 1299,
      mrp: 1999,
      images: ['/assets/products/ashwagandha.jpg'],
      stock: 100,
      isActive: true,
      categoryId: categories[0]._id,
    },
    {
      slug: 'shilajit-himalayan',
      title: 'Himalayan Shilajit Resin',
      description:
        'Pure Himalayan Shilajit resin, rich in fulvic acid and 85+ minerals. Premium grade for maximum potency.',
      ingredients: ['Pure Himalayan Shilajit Resin (500mg)', 'Fulvic Acid (60%)'],
      benefits: [
        'Boosts energy and stamina',
        'Enhances cognitive function',
        'Supports testosterone production',
        'Improves nutrient absorption',
      ],
      price: 1799,
      mrp: 2999,
      images: ['/assets/products/shilajit.jpg'],
      stock: 75,
      isActive: true,
      categoryId: categories[0]._id,
    },
    {
      slug: 'safed-musli-extract',
      title: 'Safed Musli Extract',
      description:
        'Traditional Ayurvedic herb for vitality, stamina, and reproductive health. Standardized extract for consistency.',
      ingredients: ['Safed Musli Extract (500mg)', 'Saponins (20%)'],
      benefits: [
        'Enhances libido and vitality',
        'Improves stamina and endurance',
        'Supports reproductive health',
        'Natural aphrodisiac',
      ],
      price: 1499,
      mrp: 2499,
      images: ['/assets/products/safed-musli.jpg'],
      stock: 60,
      isActive: true,
      categoryId: categories[0]._id,
    },
    {
      slug: 'gokshura-tribulus',
      title: 'Gokshura (Tribulus Terrestris)',
      description:
        'Potent testosterone booster and performance enhancer. Standardized for maximum saponin content.',
      ingredients: ['Tribulus Terrestris Extract (1000mg)', 'Saponins (40%)'],
      benefits: [
        'Boosts testosterone levels',
        'Enhances athletic performance',
        'Supports muscle growth',
        'Improves libido',
      ],
      price: 1199,
      mrp: 1999,
      images: ['/assets/products/gokshura.jpg'],
      stock: 90,
      isActive: true,
      categoryId: categories[0]._id,
    },
    {
      slug: 'shatavari-womens-health',
      title: 'Shatavari - Women\'s Wellness',
      description:
        'Traditional Ayurvedic herb for female reproductive health and hormonal balance.',
      ingredients: ['Shatavari Root Extract (500mg)', 'Saponins (30%)'],
      benefits: [
        'Balances hormones naturally',
        'Supports reproductive health',
        'Reduces PMS symptoms',
        'Improves lactation',
      ],
      price: 1399,
      mrp: 2199,
      images: ['/assets/products/shatavari.jpg'],
      stock: 80,
      isActive: true,
      categoryId: categories[1]._id,
    },
    {
      slug: 'triphala-digestive',
      title: 'Triphala Digestive Formula',
      description:
        'Classic Ayurvedic blend of three fruits for digestive health and detoxification.',
      ingredients: [
        'Amla (Indian Gooseberry)',
        'Haritaki (Terminalia Chebula)',
        'Bibhitaki (Terminalia Bellirica)',
      ],
      benefits: [
        'Improves digestion',
        'Natural detoxification',
        'Supports regularity',
        'Rich in antioxidants',
      ],
      price: 899,
      mrp: 1499,
      images: ['/assets/products/triphala.jpg'],
      stock: 120,
      isActive: true,
      categoryId: categories[2]._id,
    },
    {
      slug: 'testosterone-booster-stack',
      title: 'Complete Testosterone Booster Stack',
      description:
        'Synergistic blend of Ashwagandha, Shilajit, Safed Musli, and Gokshura for maximum results.',
      ingredients: [
        'Ashwagandha KSM-66 (300mg)',
        'Shilajit Extract (250mg)',
        'Safed Musli (250mg)',
        'Gokshura (500mg)',
      ],
      benefits: [
        'Maximum testosterone support',
        'Enhanced strength and stamina',
        'Improved libido and vitality',
        'Better muscle recovery',
      ],
      price: 2499,
      mrp: 3999,
      images: ['/assets/products/test-stack.jpg'],
      stock: 50,
      isActive: true,
      categoryId: categories[3]._id,
    },
    {
      slug: 'vitality-foundation-men',
      title: 'Men\'s Vitality Foundation',
      description:
        'Complete daily supplement stack for men featuring essential Ayurvedic herbs.',
      ingredients: [
        'Ashwagandha (400mg)',
        'Shilajit (300mg)',
        'Triphala (200mg)',
        'Gokshura (300mg)',
      ],
      benefits: [
        'All-in-one daily wellness',
        'Stress management',
        'Energy and vitality',
        'Digestive support',
      ],
      price: 2199,
      mrp: 3499,
      images: ['/assets/products/mens-foundation.jpg'],
      stock: 65,
      isActive: true,
      categoryId: categories[3]._id,
    },
  ]);
  console.log('Created products');

  // Create blog posts
  await blogPostModel.insertMany([
    {
      slug: 'benefits-of-ashwagandha',
      title: 'The Science Behind Ashwagandha: Ancient Wisdom Meets Modern Research',
      excerpt:
        'Discover how this powerful adaptogen can transform your health, backed by scientific studies.',
      body: `Ashwagandha (Withania somnifera) has been used in Ayurvedic medicine for over 3,000 years...`,
      tags: ['ashwagandha', 'adaptogens', 'stress-relief', 'testosterone'],
      published: true,
      author: 'Dr. Ayurveda Team',
    },
    {
      slug: 'natural-testosterone-boosters',
      title: 'Natural Ways to Boost Testosterone: A Complete Guide',
      excerpt:
        'Learn about evidence-based natural methods to optimize your hormone levels safely.',
      body: `Testosterone is crucial for men's health, affecting everything from muscle mass to mood...`,
      tags: ['testosterone', 'mens-health', 'hormones', 'vitality'],
      published: true,
      author: 'Dr. Ayurveda Team',
    },
    {
      slug: 'shilajit-mineral-powerhouse',
      title: 'Shilajit: The Himalayan Mineral Powerhouse',
      excerpt:
        'Explore the benefits of this ancient resin and why it\'s considered one of Ayurveda\'s most potent substances.',
      body: `Shilajit is a sticky, tar-like substance found primarily in the rocks of the Himalayas...`,
      tags: ['shilajit', 'minerals', 'energy', 'anti-aging'],
      published: true,
      author: 'Dr. Ayurveda Team',
    },
  ]);
  console.log('Created blog posts');

  console.log('\nSeed completed successfully!');
  console.log('\nAdmin credentials:');
  console.log('Email: admin@vigorayurveda.com');
  console.log('Password: Admin@123!ChangeMe');
  console.log('\nTest user credentials:');
  console.log('Email: user@test.com');
  console.log('Password: Test@123!');

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
