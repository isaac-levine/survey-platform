import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionBankQuestionDto } from './create-question-bank-question.dto';

export class UpdateQuestionBankQuestionDto extends PartialType(
  CreateQuestionBankQuestionDto,
) {}
