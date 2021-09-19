import MockDate from 'mockdate';

import { AddSurveyRepository, AddSurveyParams } from '../../../protocols/db/survey/add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call DbAddSurveyRepository with correct input', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  // test('Should throw if AddSurveyRepository throws an exception', async () => {
  //   const { sut, addSurveyRepositoryStub } = makeSut()

  //   jest.spyOn(addSurveyRepositoryStub, 'add')
  //     .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

  //   const promise = sut.add(makeFakeSurveyData())
  //   await expect(promise).rejects.toThrow()
  // })
})
