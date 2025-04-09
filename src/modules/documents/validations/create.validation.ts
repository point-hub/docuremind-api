export const createValidation = {
  code: ['required', 'string'],
  name: ['required', 'string'],
  type: ['required', 'string'],
  owner: ['required'],
  vault: ['required'],
  rack: ['required'],
}
