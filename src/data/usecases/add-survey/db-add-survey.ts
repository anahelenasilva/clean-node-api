import { AddSurveyRepository, AddSurvey, AddSurveyModel } from '../../protocols/db/survey/add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) { }

  async add(data: AddSurveyModel): Promise<void> {
    this.addSurveyRepository.add(data)
    return new Promise(resolve => resolve())
  }
}