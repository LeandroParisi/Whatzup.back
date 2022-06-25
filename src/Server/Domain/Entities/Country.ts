import { Service } from 'typedi'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class Country extends BaseEntity {
  readonly id: number

  readonly name : string

  readonly iso2 : string
}
