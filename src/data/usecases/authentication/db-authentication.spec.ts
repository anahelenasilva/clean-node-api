import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe('DbAuthentication UseCase', () => {
  
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'valid_id',
          name: 'valid_name',
          email: email,
          password: 'any_password'
        }
        return new Promise(resolve => resolve(account))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({
      email: 'any@any.com',
      password: 'any_password'
    });
    
    expect(loadSpy).toHaveBeenCalledWith('any@any.com');
  });
});