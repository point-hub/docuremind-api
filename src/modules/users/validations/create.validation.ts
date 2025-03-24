/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const createValidation = {
  username: ['required', 'string'],
  name: ['required', 'string'],
  email: ['required', 'string'],
  password: ['required', 'string'],
  role: ['required', 'string'],
}
