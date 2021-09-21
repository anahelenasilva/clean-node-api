import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result";
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { LoadSurveyResult } from "@/domain/usecases/load-survey-result";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) { }

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    if (!surveyResult || !surveyResult.surveyId) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }

    return surveyResult
  }

}