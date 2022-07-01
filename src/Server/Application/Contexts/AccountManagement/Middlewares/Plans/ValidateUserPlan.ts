/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import Container from 'typedi'
import DetailedCustomPlanDTO from '../../../../../Domain/DTOs/DetailedCustomPlanDTO'
import User from '../../../../../Domain/Entities/User'
import { FeatureNames } from '../../../../../Domain/Enums/FeatureNames'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PlanRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import { InexistentUserError } from '../../../../Shared/Errors/SpecificErrors/InexistentUserError'

export interface IValidateUserPlanParams {
  newBot? : boolean
}

export default function ValidateUserPlan(params : IValidateUserPlanParams) {
  return async (request: IAuthenticatedRequest, _response: any, next: (err?: any) => any) => {
    ValidateRequestPayload(request)

    const { user: { id } } = request

    const user = await CheckIsValidUser(id)

    await CheckUserPlan(user, params)

    next()
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

async function CheckUserPlan(user: User, rules: IValidateUserPlanParams) {
  const planRepository = Container.get(PlanRepository)

  const detailedPlan = await planRepository.GetDetailedPlan(user.planId)

  if (!detailedPlan) throw new ApiError(StatusCode.FORBIDDEN, 'You need to be adherent to a plan before trying this operation.')

  await ValidatePlan(user.id, detailedPlan, rules)
}

async function ValidatePlan(userId : number, detailedPlan: DetailedCustomPlanDTO, rules: IValidateUserPlanParams) {
  const { newBot } = rules

  if (newBot) {
    await ValidateNewBot(userId, detailedPlan)
  }
}

async function ValidateNewBot(userId: number, detailedPlan: DetailedCustomPlanDTO) {
  const botRepository = Container.get(BotRepository)
  const planAllowedBots = detailedPlan.features.find((f) => f.name === FeatureNames.NumberOfBots)
  const planMaxFeatures = detailedPlan.features.find((f) => f.name === FeatureNames.NumberOfSteps)

  if (!planAllowedBots) return

  const numberOfBots = await botRepository.Count({ userId, isActive: true })

  if (numberOfBots + 1 > planAllowedBots.maxLimit) {
    throw new ApiError(StatusCode.FORBIDDEN, 'Your plan does not allow you to have another bot.')
  }

  if (!planMaxFeatures) return
}
