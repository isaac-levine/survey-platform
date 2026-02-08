import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionBankQuestionDto } from './dto/create-question-bank-question.dto';
import { UpdateQuestionBankQuestionDto } from './dto/update-question-bank-question.dto';

@Injectable()
export class QuestionBankQuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateQuestionBankQuestionDto) {
    return this.prisma.questionBankQuestion.create({
      data: createDto,
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.questionBankQuestion.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.questionBankQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(
        `QuestionBankQuestion with ID ${id} not found`,
      );
    }

    return question;
  }

  async update(id: string, updateDto: UpdateQuestionBankQuestionDto) {
    await this.findOne(id);

    return this.prisma.questionBankQuestion.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.questionBankQuestion.delete({
      where: { id },
    });
  }

  async addToSurvey(questionBankQuestionId: string, surveyId: string) {
    const bankQuestion = await this.findOne(questionBankQuestionId);

    // Get the highest order number for questions in this survey
    const existingQuestions = await this.prisma.question.findMany({
      where: { surveyId },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const nextOrder = existingQuestions.length > 0 
      ? existingQuestions[0].order + 1 
      : 0;

    // Create a new Question based on the bank question
    return this.prisma.question.create({
      data: {
        surveyId,
        text: bankQuestion.text,
        type: bankQuestion.type,
        options: bankQuestion.options ?? undefined,
        order: nextOrder,
        questionBankQuestionId: bankQuestion.id,
      },
    });
  }
}
