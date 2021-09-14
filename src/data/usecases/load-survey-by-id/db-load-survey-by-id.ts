import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyModel } from "@/domain/models/survey";

export class DbLoadSurveyById implements LoadSurveyByIdRepository {

  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) { }

  loadById(id: string): Promise<SurveyModel> {
    return this.loadSurveyByIdRepository.loadById(id);
  }

}