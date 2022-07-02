/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { Request } from 'express'
import Container from 'typedi'
import DetailedCustomPlanDTO from '../../../../../Domain/DTOs/DetailedCustomPlanDTO'
import { Step } from '../../../../../Domain/Entities/Steps/Step'
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
import RequestPathExtractor from './Helpers/RequestPathExtractor'

export interface IValidateUserPlanParams {
  bot? : {
    newBot : boolean
    requestStepsPath : string
  }
}

export default function ValidateUserPlan(params : IValidateUserPlanParams) {
  return async (request: IAuthenticatedRequest, _response: any, next: (err?: any) => any) => {
    try {
      ValidateRequestPayload(request)

      const { user: { id } } = request

      const user = await CheckIsValidUser(id)

      await CheckUserPlan(user, params, request)

      next()
    } catch (error) {
      if (error instanceof ApiError) {
        next(error)
      } else {
        next(new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, error))
      }
    }
  }
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

async function CheckIsValidUser(id: number) : Promise<User> {
  const userRepository = Container.get(UserRepository)
  const user = await userRepository.FindOne({ id })

  if (!user) throw new InexistentUserError()

  if (!user.planId) throw new ApiError(StatusCode.FORBIDDEN, 'You need to have a plan before creating a bot.')

  return user
}

async function CheckUserPlan(user: User, rules: IValidateUserPlanParams, request : Request) {
  const planRepository = Container.get(PlanRepository)

  const detailedPlan = await planRepository.GetDetailedPlan(user.planId)

  if (!detailedPlan) throw new ApiError(StatusCode.FORBIDDEN, 'You need to be adherent to a plan before trying this operation.')

  await ValidatePlan(user.id, detailedPlan, rules, request)
}

async function ValidatePlan(
  userId : number,
  detailedPlan: DetailedCustomPlanDTO,
  rules: IValidateUserPlanParams,
  request : Request,
) {
  const { bot: { newBot } } = rules

  if (newBot) {
    await ValidateNewBot(userId, detailedPlan, request, rules.bot)
  }
}

async function ValidateNewBot(
  userId: number,
  detailedPlan: DetailedCustomPlanDTO,
  request: Request,
  bot: { newBot: boolean; requestStepsPath: string },
) {
  const botRepository = Container.get(BotRepository)
  const planAllowedBots = detailedPlan.features.find((f) => f.name === FeatureNames.NumberOfBots)
  const planMaxSteps = detailedPlan.features.find((f) => f.name === FeatureNames.NumberOfSteps)

  const numberOfBots = await botRepository.Count({ userId, isActive: true })

  if (planAllowedBots && numberOfBots + 1 > planAllowedBots.maxLimit) {
    throw new ApiError(StatusCode.FORBIDDEN, 'You have reached maximum bots your plan allows.')
  }

  const numberOfSteps = RequestPathExtractor.GetInfoFromPath<Step[]>(request, bot.requestStepsPath).length

  if (planMaxSteps && planMaxSteps.maxLimit < numberOfSteps) {
    throw new ApiError(StatusCode.FORBIDDEN, `Your plan only allows ${planMaxSteps.maxLimit} steps per bot, you are trying to register ${numberOfSteps}`)
  }
}
