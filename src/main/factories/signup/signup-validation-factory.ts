
import { Validation } from '../../../presentation/controllers/signup/signup-controller-protocols'
import { EmailValidation, CompareFieldsValidation, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../main/adapters/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite  => {

  const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email',new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
