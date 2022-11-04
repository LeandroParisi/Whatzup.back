import { ErrorMessages } from '../../../Application/Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../Application/Shared/APIs/Enums/Status'
import ApiError from '../ApiError'

export class InexistentUserError extends ApiError {
  constructor(innerError? : Error) {
    super(StatusCode.NOT_FOUND, ErrorMessages.UserNotFound, innerError)
  }
}
