export const createValidation = {
  code: ['required', 'string'],
  name: ['required', 'string'],
  racks: ['required'],
  'racks.*.code': ['required'],
  'racks.*.name': ['required'],
}
