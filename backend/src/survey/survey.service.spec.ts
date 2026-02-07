import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

describe('SurveyService', () => {
  let service: SurveyService;

  const mockPrismaService = {
    survey: {
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
        SurveyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a survey', async () => {
      const createDto: CreateSurveyDto = {
        title: 'Test Survey',
        description: 'Test Description',
        propertyId: '1',
      };

      const expectedSurvey = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.survey.create.mockResolvedValue(expectedSurvey);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedSurvey);
      expect(mockPrismaService.survey.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of surveys', async () => {
      const expectedSurveys = [
        {
          id: '1',
          title: 'Survey 1',
          description: 'Description 1',
          propertyId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.survey.findMany.mockResolvedValue(expectedSurveys);

      const result = await service.findAll();

      expect(result).toEqual(expectedSurveys);
      expect(mockPrismaService.survey.findMany).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should filter surveys by propertyId when provided', async () => {
      const expectedSurveys = [
        {
          id: '1',
          title: 'Survey 1',
          description: 'Description 1',
          propertyId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.survey.findMany.mockResolvedValue(expectedSurveys);

      const result = await service.findAll('1');

      expect(result).toEqual(expectedSurveys);
      expect(mockPrismaService.survey.findMany).toHaveBeenCalledWith({
        where: { propertyId: '1' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a survey by id', async () => {
      const expectedSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        propertyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.survey.findUnique.mockResolvedValue(expectedSurvey);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedSurvey);
      expect(mockPrismaService.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaService.survey.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('update', () => {
    it('should update a survey', async () => {
      const updateDto: UpdateSurveyDto = {
        title: 'Updated Survey',
      };

      const existingSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        propertyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedSurvey = {
        ...existingSurvey,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockPrismaService.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaService.survey.update.mockResolvedValue(updatedSurvey);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedSurvey);
      expect(mockPrismaService.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockPrismaService.survey.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaService.survey.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { title: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a survey', async () => {
      const existingSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        propertyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaService.survey.delete.mockResolvedValue(existingSurvey);

      const result = await service.remove('1');

      expect(result).toEqual(existingSurvey);
      expect(mockPrismaService.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockPrismaService.survey.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaService.survey.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
