import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  async create(createSurveyDto: CreateSurveyDto) {
    return this.prisma.survey.create({
      data: createSurveyDto,
    });
  }

  async findAll(propertyId?: string) {
    const where = propertyId ? { propertyId } : {};
    return this.prisma.survey.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        property: true,
      },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${id} not found`);
    }

    return survey;
  }

  async update(id: string, updateSurveyDto: UpdateSurveyDto) {
    await this.findOne(id);

    // Filter out undefined values and only include allowed fields
    const data: Partial<CreateSurveyDto> = {};
    if (updateSurveyDto.title !== undefined) {
      data.title = updateSurveyDto.title;
    }
    if (updateSurveyDto.description !== undefined) {
      data.description = updateSurveyDto.description;
    }
    if (updateSurveyDto.propertyId !== undefined) {
      data.propertyId = updateSurveyDto.propertyId;
    }

    return this.prisma.survey.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.survey.delete({
      where: { id },
    });
  }
}
