/**
 * Available rules
 * https://github.com/mikeerickson/validatorjs?tab=readme-ov-file#available-rules
 */

export const createManyValidation = {
  'users.*.name': ['required', 'string'],
}
