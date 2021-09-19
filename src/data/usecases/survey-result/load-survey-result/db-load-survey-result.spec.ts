import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { DbLoadSurveyResult } from "./db-load-survey-result"

const makeSurveyResult = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  },
  {
    answer: 'other_answer',
    image: 'any_image',
    count: 10,
    percent: 80
  }],
  date: new Date()
})

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {

  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyResult,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}


describe('DbLoadSurveyResult usecase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_id')
  })

})