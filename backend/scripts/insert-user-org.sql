-- Insert Organization first
INSERT INTO "Organization" (id, "clerkOrgId", name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'org_39E814wgv4HKKyQPAhyIAQwHWUY',
  'Isaac Levine Organization',
  NOW(),
  NOW()
)
ON CONFLICT ("clerkOrgId") DO UPDATE SET name = EXCLUDED.name
RETURNING id;

-- Insert User (replace the organizationId with the actual ID from above)
-- First, let's get the org ID and insert the user
WITH org AS (
  SELECT id FROM "Organization" WHERE "clerkOrgId" = 'org_39E814wgv4HKKyQPAhyIAQwHWUY'
)
INSERT INTO "User" (id, "clerkId", email, name, "organizationId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  'user_39E808oVLRKOzuf0HeX4kvPDo0D',
  'isaac@example.com', -- Update this with the actual email
  'Isaac Levine',
  org.id,
  NOW(),
  NOW()
FROM org
ON CONFLICT ("clerkId") DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  "organizationId" = EXCLUDED."organizationId";
