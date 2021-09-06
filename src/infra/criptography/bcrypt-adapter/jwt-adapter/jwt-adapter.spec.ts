import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jwt', () => ({
  async sign(): Promise<string> {
    return Promise.resolve('any_token')
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  it('should call sign with correct input', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
  
  it('should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  it('should throw an exception if sign throws an exception', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error()})
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})