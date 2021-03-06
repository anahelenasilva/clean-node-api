import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { LoadSurveyResult } from '@/domain/usecases/load-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params;
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey || !survey.id) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      let accountId = httpRequest.accountId

      if (!accountId) {
        accountId = ''
      }

      const surveyResult = await this.loadSurveyResult.loadBySurveyId(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }

}