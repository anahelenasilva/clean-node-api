import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper';
import { EmailValidator, HttpRequest, Authentication, AuthenticationModel } from './login-protocols';
import { LoginController } from './login';

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub();
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub();
}

const makeFakeRequest = (): HttpRequest => (
  {
    body: {
      email: 'any@mail.com',
      password: 'any_password'
    }
  }
)

interface SutTypes {
  sut: LoginController,
  emailValidatorStub: EmailValidator,
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if an invalid email is provided', async () => {
    
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidator with correct input', async () => {
    
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  });

  it('should return 500 if EmailValidator throws an exception', async () => {
    
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  it('should call Authentication with correct input', async () => {
    
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  });

  it('should return 401 if invalid credentials are provided', async () => {
    
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  });

  it('should return 500 if Authentication throws an exception', async () => {
    
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  it('should return 200 if valid credentials are provided', async () => {
    
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  });
});