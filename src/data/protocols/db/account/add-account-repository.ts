import { AddAccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AccountModel } from '@/domain/models/account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
