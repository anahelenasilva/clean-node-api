import { HttpRequest } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from "./load-survey-result-controller"
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { SurveyModel } from '@/domain/models/survey'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date(),
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    loadById(id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }

  return new LoadSurveyByIdStub()
}


describe('LoadSurveyResult Controller', () => {

  test('Should call LoadSurveyById with correct id', async () => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
