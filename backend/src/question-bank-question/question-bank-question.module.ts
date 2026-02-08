import { Module } from '@nestjs/common';
import { QuestionBankQuestionService } from './question-bank-question.service';
import { QuestionBankQuestionController } from './question-bank-question.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionBankQuestionController],
  providers: [QuestionBankQuestionService],
  exports: [QuestionBankQuestionService],
})
export class QuestionBankQuestionModule {}
