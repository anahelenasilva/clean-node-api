import { DbAuthentication } from '../../../../../data/usecases/account/authentication/db-authentication'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()

  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)

  const authentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  return authentication
}
