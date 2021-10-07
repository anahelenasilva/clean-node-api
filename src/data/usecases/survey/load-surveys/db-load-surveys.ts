import { LoadSurveys, LoadSurveysRepository, SurveyModel } from "./db-load-account-by-token-protocols";

export class DbLoadSurveys implements LoadSurveys {

  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) { }

  async load(accountId: string): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }

}