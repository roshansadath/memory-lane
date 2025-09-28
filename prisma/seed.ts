import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Test user created:', user.email);

  // Create some tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Travel' },
      update: {},
      create: { name: 'Travel', color: '#3B82F6' },
    }),
    prisma.tag.upsert({
      where: { name: 'Family' },
      update: {},
      create: { name: 'Family', color: '#10B981' },
    }),
    prisma.tag.upsert({
      where: { name: 'Work' },
      update: {},
      create: { name: 'Work', color: '#F59E0B' },
    }),
    prisma.tag.upsert({
      where: { name: 'Adventures' },
      update: {},
      create: { name: 'Adventures', color: '#8B5CF6' },
    }),
    prisma.tag.upsert({
      where: { name: 'Memories' },
      update: {},
      create: { name: 'Memories', color: '#EC4899' },
    }),
    prisma.tag.upsert({
      where: { name: 'Holidays' },
      update: {},
      create: { name: 'Holidays', color: '#F97316' },
    }),
  ]);

  console.log('✅ Tags created:', tags.length);

  // Create a sample memory lane
  const memoryLane = await prisma.memoryLane.upsert({
    where: { slug: 'summer-adventures-2024' },
    update: {},
    create: {
      userId: user.id,
      slug: 'summer-adventures-2024',
      title: 'Summer Adventures 2024',
      description: 'All the amazing outdoor adventures from summer 2024',
      coverImageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    } as any,
  });

  console.log('✅ Memory lane created:', memoryLane.title);

  // Link tags to the memory lane
  await prisma.laneTag.createMany({
    data: [
      { laneId: memoryLane.id, tagId: tags[0].id }, // Travel
      { laneId: memoryLane.id, tagId: tags[3].id }, // Adventures
    ],
    skipDuplicates: true,
  });

  console.log('✅ Tags linked to memory lane');

  // Create a sample memory
  const memory = await prisma.memory.create({
    data: {
      laneId: memoryLane.id,
      title: 'Hiking Adventure',
      description: 'An amazing day hiking through the mountains with friends',
      occurredAt: new Date('2024-01-15'),
      sortIndex: 0,
    },
  });

  console.log('✅ Memory created:', memory.title);

  // Create sample memory images
  await prisma.memoryImage.createMany({
    data: [
      {
        memoryId: memory.id,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        alt: 'Mountain landscape',
        sortIndex: 0,
      },
      {
        memoryId: memory.id,
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        alt: 'Forest path',
        sortIndex: 1,
      },
    ],
  });

  console.log('✅ Memory images created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
