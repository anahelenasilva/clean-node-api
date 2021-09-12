import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({

  async hash (): Promise<string> {
    return await new Promise((resolve) => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise((resolve) => resolve(true))
  }

}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct inputs', async () => {
    const sut = makeSut()
    const hasSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_input')
    expect(hasSpy).toHaveBeenCalledWith('any_input', salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_input')
    expect(hash).toBe('hash')
  })

  test('Should call compre with correct inputs', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_input', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_input', 'any_hash')
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_input', 'any_hash')
    expect(isValid).toBe(true)
  })

  // test('Should return false when compare fails', async () => {
  //   const sut = makeSut()
  //   jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false))) //erro aqui
  //   const isValid = await sut.compare('any_input', 'any_hash')
  //   expect(isValid).toBe(true)
  // })
})
