import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({

  async hash (): Promise<string> {
    return await new Promise((resolve) => resolve('hash'))
  }

}))

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct inputs', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_input')
    expect(hasSpy).toHaveBeenCalledWith('any_input', salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_input')
    expect(hash).toBe('hash')
  })
})
