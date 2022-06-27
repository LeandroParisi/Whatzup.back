import { IValidationError } from './ApiValidationError'

export default class BaseErrorResponse {
  errorMessage : string

  validationErrors? : Array<IValidationError>

  /**
   *
   */
  constructor(errorMessage : string, validationErrors? : Array<IValidationError>) {
    this.errorMessage = errorMessage
    this.validationErrors = validationErrors
  }
}
