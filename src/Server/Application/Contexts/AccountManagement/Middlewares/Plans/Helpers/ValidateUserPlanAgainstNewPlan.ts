import { Service } from 'typedi'
import { FeatureDTO } from '../../../../../../Domain/DTOs/FeatureDTO'
import { FeatureNames } from '../../../../../../Domain/Enums/FeatureNames'
import { StatusCode } from '../../../../../Shared/APIs/Enums/Status'
import ApiError from '../../../../../Shared/Errors/ApiError'
import SwitchStatementeError from '../../../../../Shared/Errors/GenericErrors/SwitchStatementError'

@Service()
export class ValidateUserPlanAgainstNewPlan {
  public Validate(currentPlanFeatures: FeatureDTO[], newFeatures: FeatureDTO[]) {
    currentPlanFeatures.forEach((f) => {
      this.ValidatePlanAgainsPlan(f, newFeatures.find((nf) => nf.name === f.name))
    })
  }

  private ValidatePlanAgainsPlan(currentPlanFeature: FeatureDTO, newFeature: FeatureDTO) {
    switch (currentPlanFeature.name) {
      case FeatureNames.NumberOfBots:
        if (newFeature.maxLimit > currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, 'You have reached maximum bots your plan allows, try disabling or deleting those you are not using.')
        }
        break

      case FeatureNames.NumberOfSteps:
        if (newFeature.maxLimit > currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, `Your plan only allows ${currentPlanFeature.maxLimit} steps per bot, you are trying to register ${newFeature.maxLimit}`)
        }
        break

      case FeatureNames.PhonesPerBot:
        // TODO
        if (newFeature.maxLimit > currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, `Your plan only allows ${currentPlanFeature.maxLimit} phone numbers per bot, you are trying to register ${newFeature.maxLimit}`)
        }
        break
      default:
        throw new SwitchStatementeError(`Unmapped feature name ${currentPlanFeature.name}`)
    }
  }
}
