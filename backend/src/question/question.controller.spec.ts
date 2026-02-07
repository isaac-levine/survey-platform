import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

describe('QuestionController', () => {
  let controller: QuestionController;

  const mockQuestionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
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

      mockQuestionService.create.mockResolvedValue(expectedQuestion);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedQuestion);
      expect(mockQuestionService.create).toHaveBeenCalledWith(createDto);
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

      mockQuestionService.findAll.mockResolvedValue(expectedQuestions);

      const result = await controller.findAll();

      expect(result).toEqual(expectedQuestions);
      expect(mockQuestionService.findAll).toHaveBeenCalledWith(undefined);
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

      mockQuestionService.findAll.mockResolvedValue(expectedQuestions);

      const result = await controller.findAll('1');

      expect(result).toEqual(expectedQuestions);
      expect(mockQuestionService.findAll).toHaveBeenCalledWith('1');
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

      mockQuestionService.findOne.mockResolvedValue(expectedQuestion);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedQuestion);
      expect(mockQuestionService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if question not found', async () => {
      mockQuestionService.findOne.mockRejectedValue(
        new NotFoundException('Question with ID 999 not found'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a question', async () => {
      const updateDto: UpdateQuestionDto = {
        text: 'Updated question text',
      };

      const updatedQuestion = {
        id: '1',
        surveyId: '1',
        text: 'Updated question text',
        type: 'text',
        order: 1,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQuestionService.update.mockResolvedValue(updatedQuestion);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedQuestion);
      expect(mockQuestionService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a question', async () => {
      const deletedQuestion = {
        id: '1',
        surveyId: '1',
        text: 'What is your name?',
        type: 'text',
        order: 1,
        options: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockQuestionService.remove.mockResolvedValue(deletedQuestion);

      const result = await controller.remove('1');

      expect(result).toEqual(deletedQuestion);
      expect(mockQuestionService.remove).toHaveBeenCalledWith('1');
    });
  });
});
