import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyResult: LoadSurveyById) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyResult.loadById(httpRequest.params.surveyId)
    return {} as HttpResponse
  }

}