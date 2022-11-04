import { Service } from 'typedi'
import { EnumDictionary } from '../../../../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { FeatureDTO } from '../../../../../../Domain/DTOs/FeatureDTO'
import { FeatureNames } from '../../../../../../Domain/Enums/FeatureNames'
import ApiError from '../../../../../../Domain/Errors/ApiError'
import SwitchStatementeError from '../../../../../../Domain/Errors/GenericErrors/SwitchStatementError'
import { StatusCode } from '../../../../../Shared/APIs/Enums/Status'

@Service()
export class ValidateUserPlanAgainstNewPlan {
  public Validate(
    currentPlanFeatures: FeatureDTO[], newFeatures: FeatureDTO[], errorMessages : EnumDictionary<FeatureNames, string>,
  ) {
    currentPlanFeatures.forEach((f) => {
      this.ValidatePlanAgainsPlan(f, newFeatures.find((nf) => nf.name === f.name), errorMessages[f.name])
    })
  }

  private ValidatePlanAgainsPlan(currentPlanFeature: FeatureDTO, newFeature: FeatureDTO, errorMessage : string) {
    switch (currentPlanFeature.name) {
      case FeatureNames.NumberOfBots:
        if (newFeature.maxLimit < currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, errorMessage)
        }
        break

      case FeatureNames.NumberOfSteps:
        if (newFeature.maxLimit < currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, errorMessage)
        }
        break

      case FeatureNames.PhonesPerBot:
        if (newFeature.maxLimit < currentPlanFeature.maxLimit) {
          throw new ApiError(StatusCode.FORBIDDEN, errorMessage)
        }
        break
      default:
        throw new SwitchStatementeError(`Unmapped feature name ${currentPlanFeature.name}`)
    }
  }
}
