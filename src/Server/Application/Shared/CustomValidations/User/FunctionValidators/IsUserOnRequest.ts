import { ErrorMessages } from '../../../APIs/Enums/Messages'
import { StatusCode } from '../../../APIs/Enums/Status'
import IAuthenticatedRequest from '../../../APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../Errors/ApiError'

export default function IsUserOnRequest(request: IAuthenticatedRequest) {
  if (!request?.user?.id) {
    throw new ApiError(
      StatusCode.NOT_FOUND,
      ErrorMessages.UserNotFound,
      new Error('User is not present on request. This request must be authenticated before moving forward.'),
    )
  }
}
