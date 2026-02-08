import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get('me')
  async getCurrentUserOrg() {
    // TODO: Extract orgId from Clerk token
    // For now, return first org (will be replaced with auth middleware)
    const orgs = await this.organizationService.findAll();
    return orgs[0] || null;
  }

  @Get('clerk/:clerkOrgId')
  findByClerkOrgId(@Param('clerkOrgId') clerkOrgId: string) {
    return this.organizationService.findByClerkOrgId(clerkOrgId);
  }

  @Get('clerk/:clerkOrgId/ensure')
  async ensureOrganization(
    @Param('clerkOrgId') clerkOrgId: string,
    @Query('name') name?: string,
  ) {
    // If name is not provided, use a default based on the clerkOrgId
    const orgName = name || `Organization ${clerkOrgId.slice(0, 8)}`;
    return this.organizationService.findOrCreate(clerkOrgId, orgName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
