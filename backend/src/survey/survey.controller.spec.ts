import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

describe('SurveyController', () => {
  let controller: SurveyController;

  const mockSurveyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        {
          provide: SurveyService,
          useValue: mockSurveyService,
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
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

      mockSurveyService.create.mockResolvedValue(expectedSurvey);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedSurvey);
      expect(mockSurveyService.create).toHaveBeenCalledWith(createDto);
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

      mockSurveyService.findAll.mockResolvedValue(expectedSurveys);

      const result = await controller.findAll();

      expect(result).toEqual(expectedSurveys);
      expect(mockSurveyService.findAll).toHaveBeenCalledWith(undefined);
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

      mockSurveyService.findAll.mockResolvedValue(expectedSurveys);

      const result = await controller.findAll('1');

      expect(result).toEqual(expectedSurveys);
      expect(mockSurveyService.findAll).toHaveBeenCalledWith('1');
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

      mockSurveyService.findOne.mockResolvedValue(expectedSurvey);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedSurvey);
      expect(mockSurveyService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockSurveyService.findOne.mockRejectedValue(
        new NotFoundException('Survey with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a survey', async () => {
      const updateDto: UpdateSurveyDto = {
        title: 'Updated Survey',
      };

      const updatedSurvey = {
        id: '1',
        title: 'Updated Survey',
        description: 'Test Description',
        propertyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSurveyService.update.mockResolvedValue(updatedSurvey);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedSurvey);
      expect(mockSurveyService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a survey', async () => {
      const deletedSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Test Description',
        propertyId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSurveyService.remove.mockResolvedValue(deletedSurvey);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedSurvey);
      expect(mockSurveyService.remove).toHaveBeenCalledWith('1');
    });
  });
});
