import request from 'supertest'

import app from '../config/app'
import env from '../config/env'

import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add surveys without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    // test('Should return 204 on add surveys with valid access token', async () => {

    //   const res = await accountCollection.insertOne({
    //     name: 'ana',
    //     email: 'ana@ana.com',
    //     password: '123',
    //     role: 'admin'
    //   })

    //   const accessToken = sign({ id: res.ops[0]._id }, env.jwtSecret)

    //   await request(app)
    //     .post('/api/surveys')
    //     .set('x-access-token', accessToken)
    //     .send({
    //       question: 'Question',
    //       answers: [{
    //         answer: 'Answer 1',
    //         image: 'http://image-name.com'
    //       },
    //       {
    //         answer: 'Answer 2',
    //       }]
    //     })
    //     .expect(204)
    // })
  })
})
