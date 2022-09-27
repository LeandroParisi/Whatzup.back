import { ErrorMessages } from '../../Application/Shared/APIs/Enums/Messages'
import { StatusCode } from '../../Application/Shared/APIs/Enums/Status'
import ApiError from './ApiError'

export interface IValidationError {
  field: string
  errors: string
}

export class ApiValidationError extends ApiError {
  validationErrors : Array<IValidationError>

  constructor(validationErrors : Array<IValidationError>, innerError? : Error) {
    super(StatusCode.BAD_REQUEST, ErrorMessages.ValidationErrors, innerError)
    this.validationErrors = validationErrors
  }
}
