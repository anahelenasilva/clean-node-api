import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct inputs', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_input')
    expect(hasSpy).toHaveBeenCalledWith('any_input', salt)
  })
})
