import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminHash = await argon2.hash('Admin@123!ChangeMe');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vigorayurveda.com' },
    update: {},
    create: {
      email: 'admin@vigorayurveda.com',
      name: 'Admin',
      hash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user created:', admin.email);

  const categories = [
    { name: 'Sexual Wellness', slug: 'sexual-wellness' },
    { name: 'Hormonal Balance', slug: 'hormonal-balance' },
    { name: 'Digestive Health', slug: 'digestive-health' },
    { name: 'Foundation Stacks', slug: 'foundation-stacks' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✓ Categories created');

  const sexualCat = await prisma.category.findUnique({ where: { slug: 'sexual-wellness' } });
  const hormonalCat = await prisma.category.findUnique({ where: { slug: 'hormonal-balance' } });
  const digestiveCat = await prisma.category.findUnique({ where: { slug: 'digestive-health' } });
  const foundationCat = await prisma.category.findUnique({ where: { slug: 'foundation-stacks' } });

  const products = [
    {
      slug: 'vigor-alpha-stack',
      title: 'Vigor Alpha Stack',
      description: 'Our flagship formula combining Ashwagandha KSM-66, Shilajit, and Safed Musli. Supports stamina, vitality, and healthy testosterone levels. 60 capsules.',
      ingredients: ['Ashwagandha KSM-66 (600mg)', 'Shilajit Extract (500mg)', 'Safed Musli (400mg)', 'Gokshura (300mg)'],
      benefits: ['Supports natural energy & stamina', 'May help with vitality & drive', 'Promotes hormonal balance', 'Reduces stress & irritability'],
      price: 1499,
      mrp: 1999,
      images: ['/assets/products/alpha-stack.jpg'],
      stock: 100,
      categoryId: sexualCat!.id,
    },
    {
      slug: 'kapikachu-power',
      title: 'Kapikachu (Mucuna) Power',
      description: 'Pure Mucuna Pruriens extract standardized to L-Dopa. Supports mood, motivation, and healthy dopamine levels. 90 capsules.',
      ingredients: ['Mucuna Pruriens Extract (500mg, 15% L-Dopa)'],
      benefits: ['Supports mood & motivation', 'May enhance drive & desire', 'Promotes healthy dopamine', 'Supports nervous system'],
      price: 999,
      mrp: 1299,
      images: ['/assets/products/kapikachu.jpg'],
      stock: 150,
      categoryId: sexualCat!.id,
    },
    {
      slug: 'morning-vigor-blend',
      title: 'Morning Vigor Blend',
      description: 'Wake up strong. Combines Gokshura, Ashwagandha, and Shilajit to support morning energy and natural vitality. 60 capsules.',
      ingredients: ['Gokshura (500mg)', 'Ashwagandha (300mg)', 'Shilajit (300mg)', 'Black Pepper Extract (5mg)'],
      benefits: ['Supports morning energy', 'May help with natural vitality', 'Promotes stamina', 'Enhances bioavailability'],
      price: 1299,
      mrp: 1699,
      images: ['/assets/products/morning-vigor.jpg'],
      stock: 80,
      categoryId: sexualCat!.id,
    },
    {
      slug: 'endurance-plus',
      title: 'Endurance Plus',
      description: 'For those seeking improved stamina and performance. Safed Musli + Kaunch Beej + Gokshura. 60 capsules.',
      ingredients: ['Safed Musli (500mg)', 'Kaunch Beej (400mg)', 'Gokshura (400mg)', 'Ashwagandha (200mg)'],
      benefits: ['Supports physical endurance', 'May help with stamina', 'Promotes performance', 'Reduces fatigue'],
      price: 1399,
      mrp: 1799,
      images: ['/assets/products/endurance-plus.jpg'],
      stock: 120,
      categoryId: sexualCat!.id,
    },
    {
      slug: 'shatavari-balance',
      title: 'Shatavari Balance',
      description: 'Gentle hormonal support for all genders. Shatavari is revered in Ayurveda for reproductive wellness. 90 capsules.',
      ingredients: ['Shatavari Extract (600mg)', 'Ashwagandha (200mg)'],
      benefits: ['Supports hormonal balance', 'Promotes reproductive wellness', 'Gentle & nourishing', 'Reduces stress'],
      price: 1099,
      mrp: 1399,
      images: ['/assets/products/shatavari.jpg'],
      stock: 90,
      categoryId: hormonalCat!.id,
    },
    {
      slug: 'testo-support-stack',
      title: 'Testo Support Stack',
      description: 'Natural support for healthy testosterone with Fenugreek, Gokshura, and Zinc. 60 capsules.',
      ingredients: ['Fenugreek Extract (600mg)', 'Gokshura (500mg)', 'Zinc (15mg)', 'Vitamin D3 (1000 IU)'],
      benefits: ['Supports healthy testosterone', 'Promotes muscle & strength', 'May enhance libido', 'Immune support'],
      price: 1199,
      mrp: 1599,
      images: ['/assets/products/testo-support.jpg'],
      stock: 110,
      categoryId: hormonalCat!.id,
    },
    {
      slug: 'triphala-digestive',
      title: 'Triphala Digestive',
      description: 'The Ayurvedic trifecta: Amalaki, Bibhitaki, Haritaki. Supports digestion, detox, and gut health. 90 tablets.',
      ingredients: ['Triphala (500mg per tablet)'],
      benefits: ['Supports healthy digestion', 'Gentle detoxification', 'Promotes gut health', 'Antioxidant-rich'],
      price: 799,
      mrp: 999,
      images: ['/assets/products/triphala.jpg'],
      stock: 200,
      categoryId: digestiveCat!.id,
    },
    {
      slug: 'probiotic-gut-flora',
      title: 'Probiotic Gut Flora',
      description: 'Multi-strain probiotic blend (10 billion CFU) to support microbiome balance and immunity. 30 capsules.',
      ingredients: ['10 Billion CFU Multi-Strain Probiotic', 'Prebiotic Fiber (100mg)'],
      benefits: ['Supports gut microbiome', 'May improve digestion', 'Boosts immunity', 'Reduces bloating'],
      price: 1299,
      mrp: 1699,
      images: ['/assets/products/probiotic.jpg'],
      stock: 70,
      categoryId: digestiveCat!.id,
    },
    {
      slug: 'omega-3-gold',
      title: 'Omega-3 Gold',
      description: 'Triple-strength fish oil with EPA & DHA. Supports heart, brain, and hormonal health. 60 softgels.',
      ingredients: ['Fish Oil (1000mg)', 'EPA (500mg)', 'DHA (250mg)'],
      benefits: ['Supports heart health', 'Promotes brain function', 'May reduce inflammation', 'Hormonal support'],
      price: 1099,
      mrp: 1499,
      images: ['/assets/products/omega3.jpg'],
      stock: 130,
      categoryId: foundationCat!.id,
    },
    {
      slug: 'astaxanthin-antioxidant',
      title: 'Astaxanthin Antioxidant',
      description: 'Powerful carotenoid from microalgae. Supports cellular health, recovery, and skin vitality. 30 softgels.',
      ingredients: ['Astaxanthin (12mg)', 'Vitamin E (10 IU)'],
      benefits: ['Powerful antioxidant', 'Supports recovery', 'Promotes skin health', 'Cellular protection'],
      price: 1499,
      mrp: 1999,
      images: ['/assets/products/astaxanthin.jpg'],
      stock: 60,
      categoryId: foundationCat!.id,
    },
    {
      slug: 'milk-thistle-liver',
      title: 'Milk Thistle Liver Support',
      description: 'Silymarin-rich Milk Thistle to support liver detoxification and metabolic health. 90 capsules.',
      ingredients: ['Milk Thistle Extract (500mg, 80% Silymarin)'],
      benefits: ['Supports liver health', 'Promotes detoxification', 'May protect liver cells', 'Metabolic support'],
      price: 999,
      mrp: 1299,
      images: ['/assets/products/milk-thistle.jpg'],
      stock: 100,
      categoryId: foundationCat!.id,
    },
    {
      slug: 'multivitamin-foundation',
      title: 'Multivitamin Foundation',
      description: 'Complete daily multivitamin with herbs. Vitamins, minerals, and adaptogens for overall wellness. 60 tablets.',
      ingredients: ['Vitamins A, C, D3, E, B-Complex', 'Zinc, Magnesium, Selenium', 'Ashwagandha (100mg)', 'Turmeric (50mg)'],
      benefits: ['Covers nutritional gaps', 'Supports immunity', 'Promotes energy', 'Adaptogenic herbs included'],
      price: 899,
      mrp: 1199,
      images: ['/assets/products/multivitamin.jpg'],
      stock: 150,
      categoryId: foundationCat!.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('✓ Products created');

  const blogPosts = [
    {
      slug: 'ashwagandha-for-stress-and-stamina',
      title: 'Ashwagandha: The Ancient Herb for Modern Stress & Stamina',
      excerpt: 'Explore how Ashwagandha supports stress management, energy levels, and hormonal balance.',
      body: `
# Ashwagandha: The Ancient Herb for Modern Stress & Stamina

Ashwagandha (Withania somnifera) is one of Ayurveda's most revered adaptogens. Used for over 3,000 years, it helps the body adapt to stress while supporting vitality and stamina.

## What is Ashwagandha?
Known as "Indian Ginseng," Ashwagandha is a root extract that helps balance cortisol (the stress hormone) and supports healthy testosterone levels in men.

## Key Benefits
- **Stress & Anxiety**: May reduce cortisol and promote calm focus.
- **Energy & Stamina**: Supports physical performance and endurance.
- **Hormonal Balance**: May help with healthy testosterone and libido.
- **Sleep Quality**: Promotes restful sleep without grogginess.

## How We Use It
At VigorAyurveda, we use **KSM-66 Ashwagandha**—a clinically studied, full-spectrum extract standardized to withanolides. It's included in our Vigor Alpha Stack and Morning Vigor Blend.

## Dosage & Safety
Typical dose: 300–600mg daily. Generally safe, but consult a healthcare provider if pregnant, nursing, or on medication.

**Disclaimer**: This content is educational only and not medical advice. Consult a professional before starting any supplement.
      `.trim(),
      tags: ['Ashwagandha', 'Adaptogens', 'Stress', 'Stamina'],
      published: true,
    },
    {
      slug: 'understanding-sexual-wellness-ayurvedic-approach',
      title: 'Understanding Sexual Wellness: The Ayurvedic Approach',
      excerpt: 'A holistic view of sexual health rooted in Ayurvedic principles—beyond quick fixes.',
      body: `
# Understanding Sexual Wellness: The Ayurvedic Approach

In Ayurveda, sexual wellness (or *Shukra Dhatu*) is interconnected with overall vitality, digestion, hormones, and mental clarity. It's not just about performance—it's about balance.

## The Holistic View
Ayurveda sees sexual health as the culmination of seven tissue layers (dhatus). When digestion, circulation, and energy are optimized, sexual vitality naturally improves.

## Common Concerns
- **Low libido**: Often linked to stress, poor sleep, or imbalanced hormones.
- **Premature ejaculation**: May be tied to anxiety or nervous system imbalance.
- **Erectile concerns**: Can relate to circulation, cortisol, or nutrient deficiency.
- **Low morning vigor**: Reflects overall vitality and hormonal rhythm.

## The VigorAyurveda Philosophy
We combine time-tested herbs (Ashwagandha, Shilajit, Safed Musli, Kapikachu) with modern science. Our formulas support:
- Hormonal balance
- Stress reduction
- Healthy circulation
- Nervous system calm

## Lifestyle Tips
1. **Sleep 7–8 hours**: Hormones reset during deep sleep.
2. **Manage stress**: Meditation, breathwork, or yoga.
3. **Exercise regularly**: Boosts testosterone and circulation.
4. **Limit alcohol & smoking**: These harm vascular and hormonal health.

**Disclaimer**: This content is educational only. Consult a healthcare professional for persistent concerns.
      `.trim(),
      tags: ['Sexual Wellness', 'Ayurveda', 'Holistic Health'],
      published: true,
    },
    {
      slug: 'shilajit-the-himalayan-powerhouse',
      title: 'Shilajit: The Himalayan Powerhouse for Energy & Vitality',
      excerpt: 'Discover the mineral-rich resin that has been prized for centuries in Ayurvedic medicine.',
      body: `
# Shilajit: The Himalayan Powerhouse for Energy & Vitality

Shilajit is a sticky, tar-like substance found in the rocks of the Himalayas. Formed over centuries from decomposed plant matter, it's rich in fulvic acid and over 85 minerals.

## What Makes Shilajit Special?
- **Fulvic Acid**: Enhances nutrient absorption and mitochondrial energy production.
- **Trace Minerals**: Includes iron, magnesium, zinc, and more.
- **Adaptogenic**: Helps the body resist physical and mental stress.

## Benefits
- **Energy**: Supports cellular ATP production for sustained energy.
- **Testosterone**: May help maintain healthy testosterone levels in men.
- **Cognitive Function**: Supports memory and mental clarity.
- **Anti-Aging**: Antioxidant properties may slow cellular aging.

## How We Source It
We use purified, lab-tested Shilajit extract to ensure heavy metal safety and potency. It's a key ingredient in our Vigor Alpha Stack and Morning Vigor Blend.

## Usage
Typically 300–500mg daily. Start with a lower dose and increase gradually. Avoid if you have gout or high uric acid levels.

**Disclaimer**: Educational content only. Not medical advice. Consult a professional before use.
      `.trim(),
      tags: ['Shilajit', 'Energy', 'Adaptogens', 'Minerals'],
      published: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✓ Blog posts created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });