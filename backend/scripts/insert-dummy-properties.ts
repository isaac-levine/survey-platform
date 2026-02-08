import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Find the organization
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: 'org_39E814wgv4HKKyQPAhyIAQwHWUY' },
  })

  if (!organization) {
    console.error('Organization not found!')
    process.exit(1)
  }

  console.log('Creating dummy properties...')

  const properties = [
    {
      name: 'Sunset Apartments',
      address: '123 Main Street',
      type: 'Residential',
      subtype: 'Apartment Complex',
      managementModel: 'Self-Managed',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      sizeSqFt: 50000,
      class: 'B',
      organizationId: organization.id,
    },
    {
      name: 'Downtown Office Tower',
      address: '456 Business Blvd',
      type: 'Commercial',
      subtype: 'Office Building',
      managementModel: 'Third-Party',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      sizeSqFt: 120000,
      class: 'A',
      organizationId: organization.id,
    },
    {
      name: 'Riverside Retail Plaza',
      address: '789 Commerce Way',
      type: 'Commercial',
      subtype: 'Retail',
      managementModel: 'Self-Managed',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      sizeSqFt: 35000,
      class: 'B',
      organizationId: organization.id,
    },
    {
      name: 'Parkview Condominiums',
      address: '321 Oak Avenue',
      type: 'Residential',
      subtype: 'Condominium',
      managementModel: 'HOA',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      sizeSqFt: 75000,
      class: 'A',
      organizationId: organization.id,
    },
    {
      name: 'Industrial Warehouse Complex',
      address: '555 Industrial Drive',
      type: 'Industrial',
      subtype: 'Warehouse',
      managementModel: 'Third-Party',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      sizeSqFt: 200000,
      class: 'C',
      organizationId: organization.id,
    },
  ]

  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: propertyData,
    })
    console.log(`Created property: ${property.name} (${property.id})`)
  }

  console.log(`Done! Created ${properties.length} properties.`)
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
