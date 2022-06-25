import { Service } from 'typedi'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class State extends BaseEntity {
  readonly id: number

  readonly countryId : number

  readonly name : string

  readonly stateCode : string

  readonly iso2 : string
}
