import { Service } from 'typedi'
import { BaseUpdatableEntity } from './BaseClasses/BaseEntity'

@Service()
export default class City extends BaseUpdatableEntity {
  id: number

  stateId : number

  name : string
}
