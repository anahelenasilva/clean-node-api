import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerSutb implements Controller{
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
    
    const controllerStub = new ControllerSutb();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const sut = new LogControllerDecorator(controllerStub)
    
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
});