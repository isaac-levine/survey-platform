import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestionService } from './question.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    question: {
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
        QuestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a question', async () => {
      const createDto: CreateQuestionDto = {
        surveyId: '1',
        text: 'What is your name?',
        type: 'text',
        order: 1,
        options: null,
      };

      const expectedQuestion = {
        id: '1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.question.create.mockResolvedValue(expectedQuestion);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedQuestion);
      expect(prisma.question.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of questions', async () => {
      const expectedQuestions = [
        {
          id: '1',
          surveyId: '1',
          text: 'What is your name?',
          type: 'text',
          order: 1,
          options: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(expectedQuestions);

      const result = await service.findAll();

      expect(result).toEqual(expectedQuestions);
      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should filter questions by surveyId when provided', async () => {
      const expectedQuestions = [
        {
          id: '1',
          surveyId: '1',
          text: 'What is your name?',
          type: 'text',
          order: 1,
          options: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.question.findMany.mockResolvedValue(expectedQuestions);

      const result = await service.findAll('1');

      expect(result).toEqual(expectedQuestions);
      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { surveyId: '1' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a question by id', async () => {
      const expectedQuestion = {
        id: '1',
        surveyId: '1',
        text: 'What is your name?',
        type: 'text',
        order: 1,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.question.findUnique.mockResolvedValue(expectedQuestion);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedQuestion);
      expect(prisma.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(prisma.question.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('update', () => {
    it('should update a question', async () => {
      const updateDto: UpdateQuestionDto = {
        text: 'Updated question text',
      };

      const existingQuestion = {
        id: '1',
        surveyId: '1',
        text: 'What is your name?',
        type: 'text',
        order: 1,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedQuestion = {
        ...existingQuestion,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockPrismaService.question.findUnique.mockResolvedValue(existingQuestion);
      mockPrismaService.question.update.mockResolvedValue(updatedQuestion);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedQuestion);
      expect(prisma.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.update('999', { text: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a question', async () => {
      const existingQuestion = {
        id: '1',
        surveyId: '1',
        text: 'What is your name?',
        type: 'text',
        order: 1,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.question.findUnique.mockResolvedValue(existingQuestion);
      mockPrismaService.question.delete.mockResolvedValue(existingQuestion);

      const result = await service.remove('1');

      expect(result).toEqual(existingQuestion);
      expect(prisma.question.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.question.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
