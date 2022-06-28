import { AutoMap } from '@automapper/classes'
import { Service } from 'typedi'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class User extends BaseEntity {
  readonly id: number

  @AutoMap()
  readonly whatsappNumber: string

  @AutoMap()
  readonly whatsappId: string

  @AutoMap()
  readonly email: string

  @AutoMap()
  readonly password: string

  @AutoMap()
  readonly documentNumber: string

  @AutoMap()
  readonly firstName: string

  @AutoMap()
  readonly middleName?: string

  @AutoMap()
  readonly lastName: string

  @AutoMap()
  readonly countryId: number

  @AutoMap()
  readonly stateId: number

  @AutoMap()
  readonly cityId: number

  @AutoMap()
  readonly neighbourhood?: string

  @AutoMap()
  readonly addressStreet?: string

  @AutoMap()
  readonly addressNumber?: string

  @AutoMap()
  readonly addressComplement?: string

  @AutoMap()
  readonly postalCode?: string

  readonly wasActivated?: boolean

  readonly isActive?: boolean

  readonly createdAt?: Date

  readonly updatedAt?: Date

  /**
   *
   */
  constructor(
    id: number,
    whatsappNumber: string,
    whatsappId: string,
    email: string,
    password: string,
    documentNumber: string,
    firstName: string,
    lastName: string,
    countryId: number,
    stateId: number,
    cityId: number,
    middleName?: string,
    neighbourhood?: string,
    addressStreet?: string,
    addressNumber?: string,
    addressComplement?: string,
    postalCode?: string,
    wasActivated?: boolean,
    isActive?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super()
    this.id = id
    this.whatsappNumber = whatsappNumber
    this.whatsappId = whatsappId
    this.email = email
    this.password = password
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
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  public GetFullName() : string {
    return `${this.firstName}${this.middleName ?? ` ${this.middleName}`}${this.lastName}`
  }
}
