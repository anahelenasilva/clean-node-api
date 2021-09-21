import MockDate from 'mockdate';

import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result"
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import { SurveyModel } from "@/domain/models/survey"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { DbLoadSurveyResult } from "./db-load-survey-result"

const makeSurveyResult = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 0,
    percent: 0
  },
  {
    answer: 'other_answer',
    image: 'any_image',
    count: 0,
    percent: 0
  }],
  date: new Date()
})

const makeSurveyModel = (): SurveyModel => ({
  id: 'any_survey_id',
  answers: [{
    answer: 'any_answer'
  },
  {
    answer: 'other_answer',
    image: 'any_image',
  }],
  date: new Date(),
  question: 'any_question',
})

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

const makeLoadSurveyRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyRepositoryStub implements LoadSurveyByIdRepository {
    loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeSurveyModel())
    }
  }

  return new LoadSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbLoadSurveyResult,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository,
  loadSurveyRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyRepositoryStub
  }
}


describe('DbLoadSurveyResult usecase', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.loadBySurveyId('any_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.loadBySurveyId('any_id')
    expect(surveyResult).toEqual(makeSurveyResult())
  })

  test('Should call LoadSurveyByIdRespository if LoadSurveyResultByIdRespository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadById')

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve({} as SurveyResultModel))

    await sut.loadBySurveyId('any_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return SurveyResultModel with all ansers with count 0 if LoadSurveyResultByIdRespository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve({} as SurveyResultModel))

    const surveyResult = await sut.loadBySurveyId('any_id')
    expect(surveyResult).toEqual(makeSurveyResult())
  })

})