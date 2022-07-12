import { FeatureDTO } from './FeatureDTO'

export default class DetailedPlanDTO {
  id : number

  isCustomPlan : boolean

  price : number

  name? : string

  features : FeatureDTO[]

  isActive : boolean

  createdAt : Date

  updatedAt : Date
}
