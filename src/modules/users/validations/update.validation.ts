/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const updateValidation = {
  _id: ['string'],
  username: ['required', 'string'],
  name: ['required', 'string'],
  email: ['required', 'string'],
  role: ['required', 'string'],
}
