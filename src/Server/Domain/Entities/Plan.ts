import { BaseEntity } from './BaseClasses/BaseEntity'

export default class Plan extends BaseEntity {
  isCustomPlan : boolean

  price : number

  name : string

  isActive : boolean

  createdAt : Date

  updatedAt : Date
}
