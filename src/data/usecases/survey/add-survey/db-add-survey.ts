import { AddSurveyRepository, AddSurvey, AddSurveyParams } from '../../../protocols/db/survey/add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) { }

  async add(data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
    return new Promise(resolve => resolve())
  }
}
