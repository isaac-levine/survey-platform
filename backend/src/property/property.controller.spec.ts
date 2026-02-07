import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertyController', () => {
  let controller: PropertyController;
  let service: PropertyService;

  const mockPropertyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [
        {
          provide: PropertyService,
          useValue: mockPropertyService,
        },
      ],
    }).compile();

    controller = module.get<PropertyController>(PropertyController);
    service = module.get<PropertyService>(PropertyService);
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

      mockPropertyService.create.mockResolvedValue(expectedProperty);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedProperty);
      expect(service.create).toHaveBeenCalledWith(createDto);
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

      mockPropertyService.findAll.mockResolvedValue(expectedProperties);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProperties);
      expect(service.findAll).toHaveBeenCalled();
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

      mockPropertyService.findOne.mockResolvedValue(expectedProperty);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedProperty);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if property not found', async () => {
      mockPropertyService.findOne.mockRejectedValue(
        new NotFoundException('Property with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      const updateDto: UpdatePropertyDto = {
        name: 'Updated Property',
      };

      const updatedProperty = {
        id: '1',
        name: 'Updated Property',
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

      mockPropertyService.update.mockResolvedValue(updatedProperty);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedProperty);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a property', async () => {
      const deletedProperty = {
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

      mockPropertyService.remove.mockResolvedValue(deletedProperty);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedProperty);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
