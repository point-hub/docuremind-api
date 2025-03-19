export const signupValidation = {
  email: ['required', 'string', 'email'],
  password: ['required', 'string', 'min:5', 'password'],
  name: ['string', 'min:5'],
  username: ['string', 'min:5'],
}
