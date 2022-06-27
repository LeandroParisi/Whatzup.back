import { Service } from 'typedi'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class City extends BaseEntity {
  readonly id: number

  readonly name : string
}
