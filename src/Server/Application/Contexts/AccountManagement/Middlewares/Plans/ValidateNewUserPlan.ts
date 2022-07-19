/* eslint-disable max-len */
import { NextFunction, Response } from 'express'
import Container, { Service } from 'typedi'
import { EnumDictionary } from '../../../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import DetailedPlanDTO from '../../../../../Domain/DTOs/DetailedPlanDTO'
import { FeatureDTO } from '../../../../../Domain/DTOs/FeatureDTO'
import { FeatureNames } from '../../../../../Domain/Enums/FeatureNames'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { PlanRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { MiddlewareFn } from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/MiddlewareFn'
import ApiError from '../../../../Shared/Errors/ApiError'
import NullReferenceError from '../../../../Shared/Errors/GenericErrors/NullReferenceError'
import SwitchStatementeError from '../../../../Shared/Errors/GenericErrors/SwitchStatementError'
import ParsingError from '../../../../Shared/Errors/SpecificErrors/ParsingError'
import BasePlanValidationMiddlewareBuilder from './BaseClasses/BasePlanValidationMiddlewareBuilder'
import RequestPathExtractor from './Helpers/RequestPathExtractor'
import { ValidateUserPlanAgainstNewPlan } from './Helpers/ValidateUserPlanAgainstNewPlan'

export interface IValidateNewUserPlan {
  requestPlanIdPath : string
  maySkipValidation : boolean
}

@Service()
export default class ValidateNewUserPlan extends BasePlanValidationMiddlewareBuilder<IValidateNewUserPlan> {
  private planRepository = Container.get(PlanRepository)

  private botRepository = Container.get(BotRepository)

  private validateUserPlanAgainstNewPlan = Container.get(ValidateUserPlanAgainstNewPlan)

  private phoneNumberRepository = Container.get(PhoneNumberRepository)

  public BuildValidator(rules: IValidateNewUserPlan) : MiddlewareFn {
    const ruleSet = rules
    const self = this

    return async (req : IAuthenticatedRequest, res : Response, next : NextFunction) => {
      try {
        await self.ValidateRequest(req)

        const planId = RequestPathExtractor.GetInfoFromPath<number>(req, ruleSet.requestPlanIdPath)

        if (!planId) {
          throw new NullReferenceError('PlanId is null')
        }

        const { user: { id: userId } } = req

        const detailedPlan = await self.planRepository.GetDetailedPlan(planId)

        await self.ValidateNewUserPlan(userId, detailedPlan)

        next()
      } catch (error) {
        if ((error instanceof NullReferenceError || error instanceof ParsingError) && ruleSet.maySkipValidation) {
          next()
        } else if (error instanceof ApiError) {
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

    const { maxPhoneCount } = await this.phoneNumberRepository.GetBotsPhoneCountByUser(userId)

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
        return {
          ...f,
          maxLimit: maxPhoneCount,
        }
      }

      throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
    })

    const errorMessages = this.BuildErrorMessages(newPlanFeatures, currentPlanFeatures)

    this.validateUserPlanAgainstNewPlan.Validate(currentPlanFeatures, newPlanFeatures, errorMessages)
  }

  private BuildErrorMessages(newPlanFeatures: FeatureDTO[], currentPlanFeatures: FeatureDTO[]) : EnumDictionary<FeatureNames, string> {
    const errorMessages = {}

    newPlanFeatures.forEach((f) => {
      switch (f.name) {
        case FeatureNames.NumberOfBots:
          errorMessages[FeatureNames.NumberOfBots] = `Your new plan only allows ${f.maxLimit} bots, you currently have ${currentPlanFeatures.find((x) => x.name === FeatureNames.NumberOfBots).maxLimit}`
          break
        case FeatureNames.NumberOfSteps:
          errorMessages[FeatureNames.NumberOfSteps] = `Your new plan only allows ${f.maxLimit} steps per bot, you currently have a bot that has ${currentPlanFeatures.find((x) => x.name === FeatureNames.NumberOfSteps).maxLimit}`
          break
        case FeatureNames.PhonesPerBot:
          errorMessages[FeatureNames.PhonesPerBot] = `Your new plan only allows ${f.maxLimit} phone numbers per bot, you currently have a bot that has ${currentPlanFeatures.find((x) => x.name === FeatureNames.PhonesPerBot).maxLimit}`
          break
        default:
          throw new SwitchStatementeError(`Unmapped feature name ${f.name}`)
      }
    })

    return errorMessages as EnumDictionary<FeatureNames, string>
  }
}
