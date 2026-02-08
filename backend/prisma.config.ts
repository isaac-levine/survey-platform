import 'dotenv/config';

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use a dummy URL for prisma generate (doesn't need real DB)
    // Real DATABASE_URL will be used at runtime
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dummy',
  },
};
