import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { SurveyModule } from './survey/survey.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [PrismaModule, PropertyModule, SurveyModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
