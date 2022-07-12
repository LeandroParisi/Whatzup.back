import { NextFunction, Response } from 'express'
import Container, { Service } from 'typedi'
import DetailedPlanDTO from '../../../../../Domain/DTOs/DetailedPlanDTO'
import { FeatureDTO } from '../../../../../Domain/DTOs/FeatureDTO'
import { FeatureNames } from '../../../../../Domain/Enums/FeatureNames'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PlanRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { MiddlewareFn } from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/MiddlewareFn'
import ApiError from '../../../../Shared/Errors/ApiError'
import SwitchStatementeError from '../../../../Shared/Errors/GenericErrors/SwitchStatementError'
import BasePlanValidationMiddlewareBuilder from './BaseClasses/BasePlanValidationMiddlewareBuilder'
import RequestPathExtractor from './Helpers/RequestPathExtractor'
import { ValidateUserPlanAgainstNewPlan } from './Helpers/ValidateUserPlanAgainstNewPlan'

export interface IValidateNewUserPlan {
  requestPlanIdPath : string
}

@Service()
export default class ValidateNewUserPlan extends BasePlanValidationMiddlewareBuilder<IValidateNewUserPlan> {
  rules: IValidateNewUserPlan

  planId : number

  private planRepository = Container.get(PlanRepository)

  private botRepository = Container.get(BotRepository)

  private validateUserPlanAgainstNewPlan = Container.get(ValidateUserPlanAgainstNewPlan)

  public BuildValidator(rules: IValidateNewUserPlan) : MiddlewareFn {
    this.rules = rules
    const self = this

    return async (req : IAuthenticatedRequest, res : Response, next : NextFunction) => {
      try {
        const planId = RequestPathExtractor.GetInfoFromPath<number>(req, this.rules.requestPlanIdPath)

        if (!planId) {
          next()
        } else {
          this.planId = planId

          await self.ValidateRequest(req)

          const { user: { id: userId } } = req

          const detailedPlan = await self.planRepository.GetDetailedPlan(planId)

          await self.ValidateNewUserPlan(userId, detailedPlan)

          next()
        }
      } catch (error) {
        if (error instanceof ApiError) {
          next(error)
        } else {
          next(new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, error))
        }
      }
    }
  }

  private async ValidateNewUserPlan(
    userId: number,
    detailedPlan: DetailedPlanDTO,
  ) {
    const newPlanFeatures = [...detailedPlan.features]

    const userBots = await this.botRepository.FindAll({ userId, isActive: true })

    const currentPlanFeatures : FeatureDTO[] = newPlanFeatures.map((f) => {
      if (f.name === FeatureNames.NumberOfBots) {
        return {
          ...f,
          maxLimit: userBots.length,
        }
      }
      if (f.name === FeatureNames.NumberOfSteps) {
        return {
          ...f,
          maxLimit: Math.max(...userBots.map((b) => b.steps?.length)),
        }
      }
      if (f.name === FeatureNames.PhonesPerBot) {
        // TODO
        return {
          ...f,
        }
      }

      throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
    })

    this.validateUserPlanAgainstNewPlan.Validate(currentPlanFeatures, newPlanFeatures)
  }
}
