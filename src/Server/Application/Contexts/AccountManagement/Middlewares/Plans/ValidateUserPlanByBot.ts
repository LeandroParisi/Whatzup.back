/* eslint-disable max-len */
import { NextFunction, Response } from 'express'
import Container, { Service } from 'typedi'
import { EnumDictionary } from '../../../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import DetailedPlanDTO from '../../../../../Domain/DTOs/DetailedPlanDTO'
import { FeatureDTO } from '../../../../../Domain/DTOs/FeatureDTO'
import { Step } from '../../../../../Domain/Entities/Steps/Step'
import { FeatureNames } from '../../../../../Domain/Enums/FeatureNames'
import ApiError from '../../../../../Domain/Errors/ApiError'
import SwitchStatementeError from '../../../../../Domain/Errors/GenericErrors/SwitchStatementError'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { PlanRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { MiddlewareFn } from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/MiddlewareFn'
import { CreateBotStepPath } from '../../Controllers/BotController/Requests/CreateBot/CreateBotRequest'
import BasePlanValidationMiddlewareBuilder from './BaseClasses/BasePlanValidationMiddlewareBuilder'
import RequestPathExtractor from './Helpers/RequestPathExtractor'
import { ValidateUserPlanAgainstNewPlan } from './Helpers/ValidateUserPlanAgainstNewPlan'

export interface IValidateUserPlanByBot {
  newBot : boolean
  requestStepsPath? : string
  canIgnoreSteps? : boolean
}

const defaultRules : Partial<IValidateUserPlanByBot> = {
  canIgnoreSteps: false,
  requestStepsPath: CreateBotStepPath,
}

@Service()
export default class ValidateUserPlanByBot extends BasePlanValidationMiddlewareBuilder<IValidateUserPlanByBot> {
  private request : IAuthenticatedRequest

  private userRepository = Container.get(UserRepository)

  private planRepository = Container.get(PlanRepository)

  private botRepository = Container.get(BotRepository)

  private phoneNumberRepository = Container.get(PhoneNumberRepository)

  private validateUserPlanAgainstNewPlan = Container.get(ValidateUserPlanAgainstNewPlan)

  public BuildValidator(rules: IValidateUserPlanByBot) : MiddlewareFn {
    const ruleSet = { ...defaultRules, ...rules }
    const self = this

    return async (req : IAuthenticatedRequest, res : Response, next : NextFunction) => {
      try {
        self.request = req

        await self.ValidateRequest(self.request)

        const { user: { id: userId } } = req

        const detailedPlan = await self.GetDetailedPlan(userId)

        await self.ValidateBot(userId, detailedPlan, ruleSet)

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
    rules : IValidateUserPlanByBot,
  ) {
    const { newBot } = rules

    const planFeatures = [...detailedPlan.features]

    const numberOfBots = await this.botRepository.Count({ userId, isActive: true })

    const { maxPhoneCount } = await this.phoneNumberRepository.GetBotsPhoneCountByUser(userId)

    const numberOfSteps = this.TryGetStepFromRequest(rules)

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
          maxLimit: maxPhoneCount || f.maxLimit,
        }
      }

      throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
    })

    const errorMessages = this.BuildErrorMessages(planFeatures, newUserFeatures)

    this.validateUserPlanAgainstNewPlan.Validate(newUserFeatures, planFeatures, errorMessages)
  }

  private TryGetStepFromRequest(rules : IValidateUserPlanByBot) : number | null {
    try {
      const numberOfSteps = RequestPathExtractor.GetInfoFromPath<Step[]>(this.request, rules.requestStepsPath)?.length
      return numberOfSteps
    } catch (error) {
      if (rules.canIgnoreSteps) return null
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
