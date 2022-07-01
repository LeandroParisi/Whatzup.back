/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import Container from 'typedi'
import User from '../../../../../Domain/Entities/User'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import { InexistentUserError } from '../../../../Shared/Errors/SpecificErrors/InexistentUserError'

export interface IValidateUserPlanParams {
  newBot? : boolean
}

function ValidateUserPlan(params : IValidateUserPlanParams) {
  return async (request: IAuthenticatedRequest, response: any, next: (err?: any) => any) => {
    ValidateRequestPayload(request)

    const { user: { id } } = request

    const user = await CheckIsValidUser(id)

    await CheckUserPlan(user, params)
  }
}

async function CheckIsValidUser(id: number) : Promise<User> {
  const userRepository = Container.get(UserRepository)
  const user = await userRepository.FindOne({ id })

  if (!user) throw new InexistentUserError()

  if (!user.planId) throw new ApiError(StatusCode.FORBIDDEN, 'You need to have a plan before creating a bot.')

  return user
}

function ValidateRequestPayload(request: IAuthenticatedRequest) {
  if (!request?.user?.id) {
    throw new ApiError(
      StatusCode.NOT_FOUND,
      ErrorMessages.UserNotFound,
      new Error('ValidateUserPlan must come before token validation middleware, if not there will be no user id on request to be checked.'),
    )
  }
}

function CheckUserPlan(user: User, rules: IValidateUserPlanParams) {
  throw new Error('Function not implemented.')
}

export default ValidateUserPlan
