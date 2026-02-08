import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { SurveyModule } from './survey/survey.module';
import { QuestionModule } from './question/question.module';
import { OrganizationModule } from './organization/organization.module';
import { QuestionBankQuestionModule } from './question-bank-question/question-bank-question.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    PrismaModule,
    PropertyModule,
    SurveyModule,
    QuestionModule,
    OrganizationModule,
    QuestionBankQuestionModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
