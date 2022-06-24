import { Service } from 'typedi'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class User extends BaseEntity {
  readonly id: number

  readonly whatsappNumber: string

  readonly whatsappId: string

  readonly email: string

  readonly documentNumber: string

  readonly firstName: string

  readonly middleName: string

  readonly lastName: string

  readonly countryId: number

  readonly stateId: number

  readonly cityId: number

  readonly neighbourhood: string

  readonly addressStreet: string

  readonly addressNumber: string

  readonly addressComplement: string

  readonly postalCode: string

  readonly wasActivated: boolean

  readonly isActivated: boolean

  readonly createdAt: Date

  readonly updatedAt: Date
}
