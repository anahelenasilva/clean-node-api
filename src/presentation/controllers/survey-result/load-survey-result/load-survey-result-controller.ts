import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyResult: LoadSurveyById) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyResult = await this.loadSurveyResult.loadById(httpRequest.params.surveyId)
      if (!surveyResult || !surveyResult.id) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      return {} as HttpResponse
    } catch (error) {
      return serverError(error)
    }
  }

}