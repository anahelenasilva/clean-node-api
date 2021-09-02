
import { InvalidParamError, ServerError } from '../../errors'

import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorSutb: EmailValidator
}

const makeSut = (): SutTypes => { // sytem under test
  const emailValidatorSutb = makeEmailValidator()

  const sut = new EmailValidation('email', emailValidatorSutb)
  return {
    sut,
    emailValidatorSutb
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Email Validation', () => {
  
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSutb } = makeSut()
    jest.spyOn(emailValidatorSutb, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({email: 'any_email@mail.com'})
    expect(error).toEqual(new InvalidParamError('email'))
  })
  
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSutb } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSutb, 'isValid')

    sut.validate({
      email: 'any_email@mail.com'
    })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws exception', () => {
    const { sut, emailValidatorSutb } = makeSut()
    jest.spyOn(emailValidatorSutb, 'isValid').mockImplementationOnce(() => {
      throw new Error('Internal server error')
    })

    expect(sut.validate).toThrow()
  })
})
