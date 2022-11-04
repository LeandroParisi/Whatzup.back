// import { EnumDictionary } from '../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
// import DetailedCustomPlanDTO from '../../DTOs/DetailedCustomPlanDTO'
// import { FeatureDTO } from '../../DTOs/FeatureDTO'
// import { FeatureNames } from '../../Enums/FeatureNames'

// export default function GetPlanFeatures(detailedPlan : DetailedCustomPlanDTO) : EnumDictionary<FeatureNames, FeatureDTO> {
//   const possiblePlans = Object.values(FeatureNames)

//   let output : EnumDictionary<FeatureNames, FeatureDTO>

//   possiblePlans.forEach((planName) => {
//     output[planName] = detailedPlan.features.find((f) => f.name === planName)
//   })

//   return output
// }
