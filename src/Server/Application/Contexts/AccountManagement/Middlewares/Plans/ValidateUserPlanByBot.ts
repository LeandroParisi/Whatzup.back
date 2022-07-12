import { NextFunction, Response } from 'express'
import Container, { Service } from 'typedi'
import DetailedPlanDTO from '../../../../../Domain/DTOs/DetailedPlanDTO'
import { FeatureDTO } from '../../../../../Domain/DTOs/FeatureDTO'
import { Step } from '../../../../../Domain/Entities/Steps/Step'
import { FeatureNames } from '../../../../../Domain/Enums/FeatureNames'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PlanRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { MiddlewareFn } from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/MiddlewareFn'
import ApiError from '../../../../Shared/Errors/ApiError'
import SwitchStatementeError from '../../../../Shared/Errors/GenericErrors/SwitchStatementError'
import BasePlanValidationMiddlewareBuilder from './BaseClasses/BasePlanValidationMiddlewareBuilder'
import RequestPathExtractor from './Helpers/RequestPathExtractor'
import { ValidateUserPlanAgainstNewPlan } from './Helpers/ValidateUserPlanAgainstNewPlan'

export interface IValidateUserPlanByBot {
  newBot : boolean
  requestStepsPath : string
}

@Service()
export default class ValidateUserPlanByBot extends BasePlanValidationMiddlewareBuilder<IValidateUserPlanByBot> {
  rules: IValidateUserPlanByBot

  private userRepository = Container.get(UserRepository)

  private planRepository = Container.get(PlanRepository)

  private botRepository = Container.get(BotRepository)

  private validateUserPlanAgainstNewPlan = Container.get(ValidateUserPlanAgainstNewPlan)

  public BuildValidator(rules: IValidateUserPlanByBot) : MiddlewareFn {
    this.rules = rules
    const self = this

    return async (req : IAuthenticatedRequest, res : Response, next : NextFunction) => {
      try {
        await self.ValidateRequest(req)

        const { user: { id: userId } } = req

        const detailedPlan = await self.GetDetailedPlan(userId)

        await self.ValidateBot(userId, detailedPlan, req)

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

  private async GetDetailedPlan(userId: number) : Promise<DetailedPlanDTO> {
    const user = await this.userRepository.FindOne({ id: userId })

    if (!user.planId) throw new ApiError(StatusCode.FORBIDDEN, 'You need to be adherent to a plan before trying this operation.')

    const detailedPlan = await this.planRepository.GetDetailedPlan(user.planId)

    return detailedPlan
  }

  private async ValidateBot(
    userId: number,
    detailedPlan: DetailedPlanDTO,
    request: IAuthenticatedRequest,
  ) {
    const { newBot, requestStepsPath } = this.rules

    const planFeatures = [...detailedPlan.features]

    const numberOfBots = await this.botRepository.Count({ userId, isActive: true })

    const numberOfSteps = RequestPathExtractor.GetInfoFromPath<Step[]>(request, requestStepsPath)?.length

    const newUserFeatures : FeatureDTO[] = planFeatures.map((f) => {
      if (f.name === FeatureNames.NumberOfBots) {
        return {
          ...f,
          maxLimit: newBot ? numberOfBots + 1 : numberOfBots,
        }
      }
      if (f.name === FeatureNames.NumberOfSteps) {
        return {
          ...f,
          maxLimit: numberOfSteps || f.maxLimit,
        }
      }
      if (f.name === FeatureNames.PhonesPerBot) {
        return {
          ...f,
        }
      }

      throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
    })

    this.validateUserPlanAgainstNewPlan.Validate(planFeatures, newUserFeatures)
  }
}
