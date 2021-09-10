import { Collection } from 'mongodb'

import env from '../../../../main/config/env'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  // test('Should add a survey on add success', async () => {
  //   const sut = makeSut()
  //   await sut.add({
  //     question: 'any_question',
  //     answers: [{
  //       image: 'any_image',
  //       answer: 'any_answer'
  //     },
  //     {
  //       answer: 'other_answer',
  //     }],
  //   })

  //   const survey = await surveyCollection.findOne({ question: 'any_question' })

  //   expect(survey).toBeTruthy()
  // })
})
