import { StatusCode } from '../../APIs/Enums/Status'
import ApiError from '../ApiError'

export class InexistentUserError extends ApiError {
  constructor(innerError? : Error) {
    super(StatusCode.NOT_FOUND, 'User not found, please try again later or contact our support.', innerError)
  }
}
