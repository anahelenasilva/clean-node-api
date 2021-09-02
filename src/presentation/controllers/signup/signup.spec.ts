
import { ServerError } from '../../errors'

import { AddAccount, AccountModel, AddAccountModel, HttpRequest, Validation } from './signup-protocols'

import { SignUpController } from './signup'
import { badRequest } from '../../helpers/http-helper'

interface SutTypes {
  sut: SignUpController
  addAccountSutb: AddAccount
  validationSutb: Validation
}

const makeSut = (): SutTypes => { // sytem under test
  const addAccountSutb = makeAddAccount()
  const validationSutb = makeValidation()

  const sut = new SignUpController(addAccountSutb, validationSutb)
  return {
    sut,
    addAccountSutb,
    validationSutb
  }
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeFakeHttpRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'}
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('SignUp Controller', () => {
  
  test('Should call AddAccount with correct input', async () => {
    const { sut, addAccountSutb } = makeSut()
    const addSpy = jest.spyOn(addAccountSutb, 'add')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws exception', async () => {
    const { sut, addAccountSutb } = makeSut()
    jest.spyOn(addAccountSutb, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error('Internal server error')))
    })

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('Internal server error'))
  })

  test('Should return 200 if valid input is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeAccount())
  })

  test('Should call Validation with correct input', async () => {
    const { sut, validationSutb } = makeSut()
    const validateSpy = jest.spyOn(validationSutb, 'validate')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSutb } = makeSut()

    jest.spyOn(validationSutb, 'validate').mockReturnValueOnce(new Error('any_error'))

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error('any_error')))
  })
})
