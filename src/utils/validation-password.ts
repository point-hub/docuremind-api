import Validatorjs from 'validatorjs'

const containsUppercase = (value: string) => {
  return /[A-Z]/.test(value)
}

const containsLowercase = (value: string) => {
  return /[a-z]/.test(value)
}

const containsNumber = (value: string) => {
  // The \d character matches any digit from 0 to 9.
  return /\d/.test(value)
}

function containsSpecialChars(value: string) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
  return specialChars.test(value)
}

export const registerValidationPassword = () => {
  Validatorjs.register(
    'password',
    function (value) {
      if (!containsLowercase(value as string)) {
        return false
      }
      if (!containsUppercase(value as string)) {
        return false
      }
      if (!containsNumber(value as string)) {
        return false
      }
      if (!containsSpecialChars(value as string)) {
        return false
      }
      return true
    },
    'The :attribute should include lowercase, uppercase, number, and special character',
  )
}
