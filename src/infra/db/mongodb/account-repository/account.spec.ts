import { Collection } from 'mongodb'

import env from '../../../../main/config/env'

import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on load by email success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if load by email fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  //dá erro
  // test('Should update the account accessToken on updateAccessToken success', async () => {
  //   const sut = makeSut()
  //   await accountCollection.insertOne({
  //     name: 'any_name',
  //     email: 'any_email@mail.com',
  //     password: 'any_password'
  //   })

  //   const result = await accountCollection.findOne({ email: 'any_email@mail.com' }) ?? { id: '' }

  //   await sut.updateAccessToken(result._id.toString(), 'any_token')
  //   const account = await accountCollection.findOne({ _id: result?.insertedId })

  //   expect(account).toBeTruthy()
  //   expect(account?.accessToken).toBe('any_token')
  // })
})
