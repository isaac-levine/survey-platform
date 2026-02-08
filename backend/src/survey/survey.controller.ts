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
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  findAll(@Query('propertyId') propertyId?: string) {
    return this.surveyService.findAll(propertyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<CreateSurveyDto>,
  ) {
    // Extract only allowed fields, excluding undefined values
    const updateSurveyDto: UpdateSurveyDto = {};
    if (body.title !== undefined) {
      updateSurveyDto.title = body.title;
    }
    if (body.description !== undefined) {
      updateSurveyDto.description = body.description;
    }
    if (body.propertyId !== undefined) {
      updateSurveyDto.propertyId = body.propertyId;
    }
    return this.surveyService.update(id, updateSurveyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.surveyService.remove(id);
  }
}
