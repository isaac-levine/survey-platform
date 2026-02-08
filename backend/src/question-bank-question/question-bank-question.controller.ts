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
import { QuestionBankQuestionService } from './question-bank-question.service';
import { CreateQuestionBankQuestionDto } from './dto/create-question-bank-question.dto';
import { UpdateQuestionBankQuestionDto } from './dto/update-question-bank-question.dto';

@Controller('question-bank-questions')
export class QuestionBankQuestionController {
  constructor(
    private readonly questionBankQuestionService: QuestionBankQuestionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateQuestionBankQuestionDto) {
    return this.questionBankQuestionService.create(createDto);
  }

  @Get()
  findAll(@Query('organizationId') organizationId: string) {
    if (!organizationId) {
      throw new Error('organizationId query parameter is required');
    }
    return this.questionBankQuestionService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionBankQuestionService.findOne(id);
  }

  @Post(':id/add-to-survey/:surveyId')
  @HttpCode(HttpStatus.CREATED)
  addToSurvey(@Param('id') id: string, @Param('surveyId') surveyId: string) {
    return this.questionBankQuestionService.addToSurvey(id, surveyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateQuestionBankQuestionDto,
  ) {
    return this.questionBankQuestionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.questionBankQuestionService.remove(id);
  }
}
