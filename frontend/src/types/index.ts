export type QuestionType = 'text' | 'multipleChoice' | 'rating'

export interface Organization {
  id: string
  clerkOrgId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Property {
  id: string
  name: string
  address: string
  type: string
  subtype: string
  managementModel: string
  city: string
  state: string
  country: string
  sizeSqFt: number
  class: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface Survey {
  id: string
  title: string
  description?: string
  propertyId: string
  createdAt: string
  updatedAt: string
  property?: Property
  questions?: Question[]
}

export interface QuestionOptions {
  options?: string[]
  min?: number
  max?: number
}

export interface Question {
  id: string
  surveyId: string
  text: string
  type: QuestionType
  order: number
  options?: QuestionOptions
  questionBankQuestionId?: string
  createdAt: string
  updatedAt: string
}

export interface QuestionBankQuestion {
  id: string
  organizationId: string
  text: string
  type: QuestionType
  options?: QuestionOptions
  createdAt: string
  updatedAt: string
}
