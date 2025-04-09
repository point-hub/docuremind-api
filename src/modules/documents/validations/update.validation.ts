export const updateValidation = {
  code: ['required', 'string'],
  name: ['required', 'string'],
  type: ['required', 'string'],
  owner: ['required'],
  vault: ['required'],
  rack: ['required'],
}
