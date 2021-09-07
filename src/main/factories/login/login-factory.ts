import env from '../../config/env';

import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

import { Controller } from "../../../presentation/protocols";
import { LoginController } from '../../../presentation/controllers/login/login-controller';

import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';

import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';

import { makeLoginValidation } from './login-validation-factory';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';

export const makeLoginController = (): Controller  => {
  const accountMongoRepository = new AccountMongoRepository()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)

  const loginValidationFactory = makeLoginValidation()
  const loginController = new LoginController(authentication, loginValidationFactory)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}