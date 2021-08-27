import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTupes {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub  
  }
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
});