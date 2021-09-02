import { LogErrorRepository } from "../../data/protocols/log-error-repository";

import { serverError } from "../../presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";

import { LogControllerDecorator } from "./log";

interface SutTupes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerSutb implements Controller {
    handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'test',
          email: 'email@mail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      }
      return new Promise(resolve => resolve(httpResponse));
    }
  }
  
  return new ControllerSutb();
}

const makeSut = (): SutTupes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }
  
  return new LogErrorRepositoryStub();
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = {
      body: {
        name: 'test',
        email: 'email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  
  test('Should return the same result as controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test',
        email: 'email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body).toEqual({
      name: 'test',
      email: 'email@mail.com',
      password: '123',
      passwordConfirmation: '123'
    });
  });
  
  test('Should call LogErrorRepository with right error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    
    const fakeError = new Error('Internal server error')
    fakeError.stack = 'fake stack'
    const error = serverError(fakeError)
    
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

    const httpRequest = {
      body: {
        name: 'test',
        email: 'email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('fake stack')
  });
});