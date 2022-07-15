/* eslint-disable max-len */
import { NextFunction, Response } from 'express'
import Container, { Service } from 'typedi'
import { EnumDictionary } from '../../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
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
  canIgnoreSteps? : boolean
}

const defaultRules : Partial<IValidateUserPlanByBot> = {
  canIgnoreSteps: false,
}

@Service()
export default class ValidateUserPlanByBot extends BasePlanValidationMiddlewareBuilder<IValidateUserPlanByBot> {
  rules: IValidateUserPlanByBot

  request : IAuthenticatedRequest

  private userRepository = Container.get(UserRepository)

  private planRepository = Container.get(PlanRepository)

  private botRepository = Container.get(BotRepository)

  private validateUserPlanAgainstNewPlan = Container.get(ValidateUserPlanAgainstNewPlan)

  public BuildValidator(rules: IValidateUserPlanByBot) : MiddlewareFn {
    this.rules = { ...defaultRules, ...rules }
    const self = this

    return async (req : IAuthenticatedRequest, res : Response, next : NextFunction) => {
      try {
        self.request = req

        await self.ValidateRequest(self.request)

        const { user: { id: userId } } = req

        const detailedPlan = await self.GetDetailedPlan(userId)

        await self.ValidateBot(userId, detailedPlan)

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
  ) {
    const { newBot } = this.rules

    const planFeatures = [...detailedPlan.features]

    const numberOfBots = await this.botRepository.Count({ userId, isActive: true })

    const numberOfSteps = this.TryGetStepFromRequest()

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
        // TODO
        return {
          ...f,
        }
      }

      throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
    })

    const errorMessages = this.BuildErrorMessages(planFeatures, newUserFeatures)

    this.validateUserPlanAgainstNewPlan.Validate(newUserFeatures, planFeatures, errorMessages)
  }

  private TryGetStepFromRequest() : number | null {
    try {
      const numberOfSteps = RequestPathExtractor.GetInfoFromPath<Step[]>(this.request, this.rules.requestStepsPath)?.length
      return numberOfSteps
    } catch (error) {
      if (this.rules.canIgnoreSteps) return null
      throw error
    }
  }

  private BuildErrorMessages(planFeatures: FeatureDTO[], newUserFeatures: FeatureDTO[]) : EnumDictionary<FeatureNames, string> {
    const errorMessages = {}

    planFeatures.forEach((f) => {
      switch (f.name) {
        case FeatureNames.NumberOfBots:
          errorMessages[FeatureNames.NumberOfBots] = 'You have reached maximum bots your plan allows, try disabling or deleting those you are not using.'
          break
        case FeatureNames.NumberOfSteps:
          errorMessages[FeatureNames.NumberOfSteps] = `Your plan only allows ${f.maxLimit} steps per bot, you are trying to register ${newUserFeatures.find((x) => x.name === FeatureNames.NumberOfSteps).maxLimit}`
          break
        case FeatureNames.PhonesPerBot:
          errorMessages[FeatureNames.PhonesPerBot] = `Your plan only allows ${f.maxLimit} phone numbers per bot, you are trying to register ${newUserFeatures.find((x) => x.name === FeatureNames.PhonesPerBot).maxLimit}`
          break
        default:
          throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
      }
    })

    return errorMessages as EnumDictionary<FeatureNames, string>
  }
}
