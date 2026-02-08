import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create a default organization (you can customize this)
  const defaultOrg = await prisma.organization.upsert({
    where: { clerkOrgId: 'default-org' },
    update: {},
    create: {
      clerkOrgId: 'default-org',
      name: 'Default Organization',
    },
  });

  console.log('Created default organization:', defaultOrg);

  // Create some sample question bank questions (only if they don't exist)
  const existingQuestions = await prisma.questionBankQuestion.findMany({
    where: { organizationId: defaultOrg.id },
  });

  if (existingQuestions.length === 0) {
    const sampleQuestions = [
      {
        organizationId: defaultOrg.id,
        text: 'How satisfied are you with our service?',
        type: 'rating',
        options: { min: 1, max: 5 },
      },
      {
        organizationId: defaultOrg.id,
        text: 'What is your primary reason for using our platform?',
        type: 'multipleChoice',
        options: {
          options: [
            'Ease of use',
            'Features',
            'Price',
            'Support',
            'Other',
          ],
        },
      },
      {
        organizationId: defaultOrg.id,
        text: 'Please provide any additional feedback',
        type: 'text',
        options: undefined,
      },
    ];

    for (const question of sampleQuestions) {
      await prisma.questionBankQuestion.create({
        data: {
          organizationId: question.organizationId,
          text: question.text,
          type: question.type,
          options: question.options === null ? undefined : question.options,
        },
      });
    }

    console.log('Created sample question bank questions');
  } else {
    console.log('Question bank questions already exist, skipping...');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
