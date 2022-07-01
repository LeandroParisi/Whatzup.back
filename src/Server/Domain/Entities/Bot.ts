import { BaseEntity } from './BaseClasses/BaseEntity'
import { Step } from './Steps/Step'

export default class Bot extends BaseEntity {
  readonly id : number

  readonly botName : string

  readonly steps : Step[]

  readonly userId : number

  readonly isActive : boolean

  readonly createdAt : Date

  readonly updatedAt : Date
}
