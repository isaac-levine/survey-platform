import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertyService', () => {
  let service: PropertyService;
  let prisma: PrismaService;

  const mockPrismaService = {
    property: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const createDto: CreatePropertyDto = {
        name: 'Test Property',
        address: '123 Main St',
        type: 'Residential',
        subtype: 'Apartment',
        managementModel: 'Self-Managed',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        sizeSqFt: 1000,
        class: 'A',
      };

      const expectedProperty = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.property.create.mockResolvedValue(expectedProperty);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedProperty);
      expect(prisma.property.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const expectedProperties = [
        {
          id: '1',
          name: 'Property 1',
          address: '123 Main St',
          type: 'Residential',
          subtype: 'Apartment',
          managementModel: 'Self-Managed',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          sizeSqFt: 1000,
          class: 'A',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.property.findMany.mockResolvedValue(expectedProperties);

      const result = await service.findAll();

      expect(result).toEqual(expectedProperties);
      expect(prisma.property.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      const expectedProperty = {
        id: '1',
        name: 'Test Property',
        address: '123 Main St',
        type: 'Residential',
        subtype: 'Apartment',
        managementModel: 'Self-Managed',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        sizeSqFt: 1000,
        class: 'A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.property.findUnique.mockResolvedValue(expectedProperty);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedProperty);
      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if property not found', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      const updateDto: UpdatePropertyDto = {
        name: 'Updated Property',
        sizeSqFt: 2000,
      };

      const existingProperty = {
        id: '1',
        name: 'Test Property',
        address: '123 Main St',
        type: 'Residential',
        subtype: 'Apartment',
        managementModel: 'Self-Managed',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        sizeSqFt: 1000,
        class: 'A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProperty = {
        ...existingProperty,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockPrismaService.property.findUnique.mockResolvedValue(existingProperty);
      mockPrismaService.property.update.mockResolvedValue(updatedProperty);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedProperty);
      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.property.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if property not found', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a property', async () => {
      const existingProperty = {
        id: '1',
        name: 'Test Property',
        address: '123 Main St',
        type: 'Residential',
        subtype: 'Apartment',
        managementModel: 'Self-Managed',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        sizeSqFt: 1000,
        class: 'A',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.property.findUnique.mockResolvedValue(existingProperty);
      mockPrismaService.property.delete.mockResolvedValue(existingProperty);

      const result = await service.remove('1');

      expect(result).toEqual(existingProperty);
      expect(prisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.property.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if property not found', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
