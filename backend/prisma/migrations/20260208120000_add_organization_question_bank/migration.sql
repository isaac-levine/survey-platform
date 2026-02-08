-- CreateTable
CREATE TABLE IF NOT EXISTS "Organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "QuestionBankQuestion" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBankQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_clerkOrgId_key" ON "Organization"("clerkOrgId");

-- Create a default organization for existing data
INSERT INTO "Organization" ("id", "clerkOrgId", "name", "createdAt", "updatedAt")
SELECT 'default-org-id', 'default-org', 'Default Organization', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Organization" WHERE "clerkOrgId" = 'default-org');

-- AlterTable: Add organizationId to User (with default for existing rows)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Update existing users to use default organization
UPDATE "User" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;

-- Make organizationId required
ALTER TABLE "User" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable: Add organizationId to Property (with default for existing rows)
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Update existing properties to use default organization
UPDATE "Property" SET "organizationId" = 'default-org-id' WHERE "organizationId" IS NULL;

-- Make organizationId required
ALTER TABLE "Property" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable: Add questionBankQuestionId to Question (optional)
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "questionBankQuestionId" TEXT;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'User_organizationId_fkey'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" 
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Property_organizationId_fkey'
    ) THEN
        ALTER TABLE "Property" ADD CONSTRAINT "Property_organizationId_fkey" 
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'QuestionBankQuestion_organizationId_fkey'
    ) THEN
        ALTER TABLE "QuestionBankQuestion" ADD CONSTRAINT "QuestionBankQuestion_organizationId_fkey" 
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Question_questionBankQuestionId_fkey'
    ) THEN
        ALTER TABLE "Question" ADD CONSTRAINT "Question_questionBankQuestionId_fkey" 
        FOREIGN KEY ("questionBankQuestionId") REFERENCES "QuestionBankQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
