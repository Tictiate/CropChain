import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Test Users
  const farmer = await prisma.user.upsert({
    where: { username: 'farmer_test' },
    update: {},
    create: {
      username: 'farmer_test',
      password: passwordHash,
      role: 'farmer',
      location: 'Punjab, India',
    },
  })

  const distributor = await prisma.user.upsert({
    where: { username: 'dist_test' },
    update: {},
    create: {
      username: 'dist_test',
      password: passwordHash,
      role: 'distributor',
      location: 'Delhi, India',
    },
  })

  const retailer = await prisma.user.upsert({
    where: { username: 'retail_test' },
    update: {},
    create: {
      username: 'retail_test',
      password: passwordHash,
      role: 'retailer',
      location: 'Mumbai, India',
    },
  })

  const consumer = await prisma.user.upsert({
    where: { username: 'consumer_test' },
    update: {},
    create: {
      username: 'consumer_test',
      password: passwordHash,
      role: 'consumer',
    },
  })

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: passwordHash,
      role: 'admin',
    },
  })

  console.log("Created test users.")

  // 2. Create Mock Crops
  const mockCrops = [
    {
      farmer_id: farmer.id,
      crop_name: 'Organic Wheat',
      quality: 'Grade A',
      quantity: '500',
      expected_price: 30.50,
      location: 'Punjab, India',
    },
    {
      farmer_id: farmer.id,
      crop_name: 'Basmati Rice',
      quality: 'Premium',
      quantity: '200',
      expected_price: 85.00,
      location: 'Haryana, India',
    },
    {
      farmer_id: farmer.id,
      crop_name: 'Tomatoes',
      quality: 'Red Fresh',
      quantity: '100',
      expected_price: 40.00,
      location: 'Nashik, Maharashtra',
    }
  ]

  for (const crop of mockCrops) {
    await prisma.cropLog.create({
      data: crop,
    })
  }

  console.log("Seeded mock crops successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
