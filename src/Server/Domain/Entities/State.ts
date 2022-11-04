import { Service } from 'typedi'
import { BaseUpdatableEntity } from './BaseClasses/BaseEntity'

@Service()
export default class State extends BaseUpdatableEntity {
  readonly id: number

  readonly countryId : number

  readonly name : string

  readonly stateCode : string
}
