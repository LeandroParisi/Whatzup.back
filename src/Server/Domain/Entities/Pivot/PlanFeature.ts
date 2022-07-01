import { BaseEntity } from '../BaseClasses/BaseEntity'

export default class PlanFeature extends BaseEntity {
  planId : number

  featureId : number

  maxLimit? : number

  isActive : boolean

  createdAt :Date

  updatedAt : Date
}
