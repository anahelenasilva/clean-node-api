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
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    if (!surveyResult || !surveyResult.surveyId) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer, { count: 0, percent: 0 }))
      }
    }

    return surveyResult
  }

}