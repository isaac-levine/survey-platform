import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Creating organization...')
  
  // Create or update organization
  const organization = await prisma.organization.upsert({
    where: { clerkOrgId: 'org_39E814wgv4HKKyQPAhyIAQwHWUY' },
    update: { name: 'Isaac Levine Organization' },
    create: {
      clerkOrgId: 'org_39E814wgv4HKKyQPAhyIAQwHWUY',
      name: 'Isaac Levine Organization',
    },
  })

  console.log('Organization created:', organization.id)

  console.log('Creating user...')
  
  // Create or update user
  const user = await prisma.user.upsert({
    where: { clerkId: 'user_39E808oVLRKOzuf0HeX4kvPDo0D' },
    update: {
      name: 'Isaac Levine',
      email: 'isaac@example.com', // Update with actual email if needed
      organizationId: organization.id,
    },
    create: {
      clerkId: 'user_39E808oVLRKOzuf0HeX4kvPDo0D',
      name: 'Isaac Levine',
      email: 'isaac@example.com', // Update with actual email if needed
      organizationId: organization.id,
    },
  })

  console.log('User created:', user.id)
  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
