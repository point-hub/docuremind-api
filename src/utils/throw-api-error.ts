import { BaseErrorHandler, type TypeCodeStatus } from '@point-hub/papi'

export interface IOptions {
  message?: string
  errors?: object
}

export interface IThrowApiError {
  (codeStatus: TypeCodeStatus, options?: IOptions): void
}

export const throwApiError: IThrowApiError = (codeStatus, options) => {
  throw new BaseErrorHandler.ApiError(codeStatus, options)
}
