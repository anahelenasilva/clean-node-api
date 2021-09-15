import { LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-by-id-protocols";

export class DbLoadSurveyById implements LoadSurveyByIdRepository {

  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }

  loadById(id: string): Promise<SurveyModel> {
    return this.loadSurveyByIdRepository.loadById(id);
  }

}