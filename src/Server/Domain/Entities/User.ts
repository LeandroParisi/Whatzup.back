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

  /**
   *
   */
  constructor(
    id: number,
    whatsappNumber: string,
    whatsappId: string,
    email: string,
    documentNumber: string,
    firstName: string,
    middleName: string,
    lastName: string,
    countryId: number,
    stateId: number,
    cityId: number,
    neighbourhood: string,
    addressStreet: string,
    addressNumber: string,
    addressComplement: string,
    postalCode: string,
    wasActivated: boolean,
    isActivated: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super()
    this.id = id
    this.whatsappNumber = whatsappNumber
    this.whatsappId = whatsappId
    this.email = email
    this.documentNumber = documentNumber
    this.firstName = firstName
    this.middleName = middleName
    this.lastName = lastName
    this.countryId = countryId
    this.stateId = stateId
    this.cityId = cityId
    this.neighbourhood = neighbourhood
    this.addressStreet = addressStreet
    this.addressNumber = addressNumber
    this.addressComplement = addressComplement
    this.postalCode = postalCode
    this.wasActivated = wasActivated
    this.isActivated = isActivated
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
