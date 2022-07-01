import { BaseEntity } from './BaseClasses/BaseEntity'

export default class Feature extends BaseEntity {
  id : number

  typeId : number

  name : string

  isActive : boolean

  createdAt :Date

  updatedAt : Date
}
