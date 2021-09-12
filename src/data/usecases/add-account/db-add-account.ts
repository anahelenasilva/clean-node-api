import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (account === null || account.name === '') {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const accountModel = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
      return accountModel
    }

    const emptyAccount: AccountModel = { email: '', id: '', name: '', password: '' }
    return emptyAccount
  }
}
