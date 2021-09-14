import {
  AccountModel,
  Decrypter,
  LoadAccountByToken,
  LoadAccountByTokenRepository
} from "./db-load-account-by-token-protocols"

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) { }

  async load(accessToken: string, role?: string | undefined): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      return account
    }

    return new Promise(resolve => resolve({} as AccountModel))
  }
}
