import { AccountModel } from "@/domain/models/account";

export const mockAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'hashed_password'
})