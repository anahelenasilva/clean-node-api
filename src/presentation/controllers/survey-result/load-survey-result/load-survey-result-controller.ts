import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const surveyResult = await this.loadSurveyById.loadById(surveyId)
      if (!surveyResult || !surveyResult.id) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      await this.loadSurveyResult.loadBySurveyId(surveyId)
      return {} as HttpResponse
    } catch (error) {
      return serverError(error)
    }
  }

}