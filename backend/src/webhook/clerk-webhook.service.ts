import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handleEvent(eventType: string, data: any): Promise<void> {
    switch (eventType) {
      case 'user.created':
        await this.createUser(data);
        break;
      case 'user.updated':
        await this.upsertUser(data);
        break;
      case 'user.deleted':
        await this.deleteUser(data.id);
        break;
      case 'organization.created':
        await this.createOrganization(data);
        break;
      case 'organization.updated':
        await this.upsertOrganization(data);
        break;
      case 'organization.deleted':
        await this.deleteOrganization(data.id);
        break;
      case 'organizationMembership.created':
      case 'organizationMembership.updated':
        await this.updateUserRole(data);
        break;
      case 'organizationMembership.deleted':
        await this.clearUserRole(data);
        break;
      default:
        this.logger.log(`Unhandled Clerk event: ${eventType}`);
    }
  }

  private async createUser(data: any): Promise<void> {
    const email = data.email_addresses?.[0]?.email_address || '';
    const firstName = data.first_name || '';
    const lastName = data.last_name || '';
    const name = firstName || lastName ? `${firstName} ${lastName}`.trim() : null;

    this.logger.log(`Creating user: ${data.id} - ${email}`);

    // Note: User creation without organizationId is not possible due to schema constraint
    // Users will be created when they join an organization via organizationMembership.created
    // This event is logged for reference but user creation is deferred
    this.logger.log(`User ${data.id} created in Clerk, waiting for organization membership to create in DB`);
  }

  private async upsertUser(data: any): Promise<void> {
    const email = data.email_addresses?.[0]?.email_address || '';
    const firstName = data.first_name || '';
    const lastName = data.last_name || '';
    const name = firstName || lastName ? `${firstName} ${lastName}`.trim() : null;

    // Only update if user exists (was created via organization membership)
    const existingUser = await this.prisma.user.findUnique({
      where: { clerkId: data.id },
    });

    if (existingUser) {
      await this.prisma.user.update({
        where: { clerkId: data.id },
        data: {
          email,
          name,
        },
      });
      this.logger.log(`User updated: ${data.id}`);
    } else {
      this.logger.log(`User ${data.id} not found in DB, skipping update (will be created on org membership)`);
    }
  }

  private async deleteUser(clerkId: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { clerkId } });
      this.logger.log(`User deleted: ${clerkId}`);
    } catch (error) {
      // User might not exist in our DB yet
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to delete user ${clerkId}: ${msg}`);
    }
  }

  private async updateUserRole(data: any): Promise<void> {
    const userId = data.public_user_data?.user_id;
    const organizationId = data.organization?.id || data.organization_id;
    const role = data.role;

    if (!userId) {
      this.logger.warn(`Missing userId in organizationMembership event`);
      return;
    }

    if (!organizationId) {
      this.logger.warn(`Missing organizationId in organizationMembership event for user ${userId}`);
      return;
    }

    if (!role) {
      this.logger.warn(`Missing role in organizationMembership event for user ${userId}`);
      return;
    }

    // Ensure organization exists first
    const org = await this.prisma.organization.findUnique({
      where: { clerkOrgId: organizationId },
    });

    if (!org) {
      this.logger.warn(
        `Organization ${organizationId} does not exist in DB, cannot add user`,
      );
      return;
    }

    // Get user data from Clerk payload or use defaults
    const email = data.public_user_data?.identifier || '';
    const firstName = data.public_user_data?.first_name || '';
    const lastName = data.public_user_data?.last_name || '';
    const name = firstName || lastName ? `${firstName} ${lastName}`.trim() : null;

    // Create or update user with organization and role
    await this.prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: email || undefined,
        name: name || undefined,
        organizationId: org.id,
        role,
      },
      create: {
        clerkId: userId,
        email: email || 'unknown@example.com', // Required field, will be updated on user.updated event
        name,
        organizationId: org.id,
        role,
      },
    });

    this.logger.log(`User ${userId} added to organization ${org.id} with role: ${role}`);
  }

  private async clearUserRole(data: any): Promise<void> {
    const userId = data.public_user_data?.user_id;

    if (!userId) {
      this.logger.warn(`Missing userId in organizationMembership.deleted event`);
      return;
    }

    // Note: We can't remove organizationId as it's required in schema
    // Instead, we clear the role. User will remain in the organization
    // If you want to remove users when they leave orgs, you'd need to make organizationId nullable
    try {
      await this.prisma.user.update({
        where: { clerkId: userId },
        data: { role: null },
      });
      this.logger.log(`User ${userId} role cleared (still in organization)`);
    } catch (error) {
      // User might not exist in our DB
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to clear role for user ${userId}: ${msg}`);
    }
  }

  private async createOrganization(data: any): Promise<void> {
    await this.prisma.organization.upsert({
      where: { clerkOrgId: data.id },
      update: {
        name: data.name,
      },
      create: {
        clerkOrgId: data.id,
        name: data.name,
      },
    });
    this.logger.log(`Organization created: ${data.id}`);
  }

  private async upsertOrganization(data: any): Promise<void> {
    await this.prisma.organization.upsert({
      where: { clerkOrgId: data.id },
      update: {
        name: data.name,
      },
      create: {
        clerkOrgId: data.id,
        name: data.name,
      },
    });
    this.logger.log(`Organization updated: ${data.id}`);
  }

  private async deleteOrganization(clerkOrgId: string): Promise<void> {
    try {
      await this.prisma.organization.delete({ where: { clerkOrgId } });
      this.logger.log(`Organization deleted: ${clerkOrgId}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to delete organization ${clerkOrgId}: ${msg}`);
    }
  }
}
