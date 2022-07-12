import Container from 'typedi'
import { ErrorMessages } from '../../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { MiddlewareFn } from '../../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/MiddlewareFn'
import { IsExistentUserConstraint } from '../../../../../Shared/CustomValidations/User/ClassValidators/IsExistentUser'
import ApiError from '../../../../../Shared/Errors/ApiError'
import { InexistentUserError } from '../../../../../Shared/Errors/SpecificErrors/InexistentUserError'

export default abstract class BasePlanValidationMiddlewareBuilder<Rules> {
  abstract rules : Rules

  public abstract BuildValidator (rules : Rules) : MiddlewareFn

  protected async ValidateRequest(request: IAuthenticatedRequest) {
    this.IsUserOnRequest(request)

    const { user: { id: userId } } = request

    const isValidUser = await Container.get(IsExistentUserConstraint).validate(userId)

    if (!isValidUser) {
      throw new InexistentUserError()
    }
  }

  private IsUserOnRequest(request: IAuthenticatedRequest) {
    if (!request?.user?.id) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        ErrorMessages.UserNotFound,
        new Error('User is not present on request. This request must be authenticated before moving forward.'),
      )
    }
  }
}
