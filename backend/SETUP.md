# Database Setup Instructions

## Prerequisites
- PostgreSQL must be running
- Database credentials in `.env` must be correct

## Quick Setup

### Option 1: Using Prisma Migrate (Recommended)

```bash
# 1. Ensure PostgreSQL is running
# 2. Create the database (if it doesn't exist)
createdb survey_platform
# Or using psql:
# psql -U postgres -c "CREATE DATABASE survey_platform;"

# 3. Run migrations
npm run prisma:migrate

# 4. Seed the database (optional)
npm run prisma:seed
```

### Option 2: Using Prisma DB Push (Faster, but doesn't track migrations)

```bash
# 1. Ensure PostgreSQL is running
# 2. Create the database
createdb survey_platform

# 3. Push schema to database
npx prisma db push --accept-data-loss

# 4. Generate Prisma client
npm run prisma:generate

# 5. Seed the database
npm run prisma:seed
```

## Troubleshooting

If you get "database does not exist" error:
- Create it: `createdb survey_platform`
- Or update `DATABASE_URL` in `.env` to point to an existing database

If you get "User was denied access" error:
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env` match your PostgreSQL setup
- Ensure the database user has proper permissions

## What the Seed Script Does

- Creates a default organization (`default-org`)
- Adds sample question bank questions (rating, multiple choice, text)
