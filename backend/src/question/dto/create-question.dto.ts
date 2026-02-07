export class CreateQuestionDto {
  surveyId: string;
  text: string;
  type: string;
  order: number;
  options?: any;
}
