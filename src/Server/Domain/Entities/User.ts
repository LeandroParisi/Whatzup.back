/* eslint-disable max-classes-per-file */
import { AutoMap } from '@automapper/classes'
import { sql } from '@databases/pg'
import { Service } from 'typedi'
import { KeysOf } from '../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { Users } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class User extends BaseEntity {
  id: number

  phoneNumberId : number

  @AutoMap()
  email: string

  @AutoMap()
  password: string

  @AutoMap()
  documentNumber: string

  @AutoMap()
  firstName: string

  @AutoMap()
  middleName?: string

  @AutoMap()
  lastName: string

  countryId: number

  stateId: number

  cityId: number

  @AutoMap()
  neighbourhood?: string

  @AutoMap()
  addressStreet?: string

  @AutoMap()
  addressNumber?: string

  @AutoMap()
  addressComplement?: string

  @AutoMap()
  postalCode?: string

  isVerified?: boolean

  isActive?: boolean

  createdAt?: Date

  updatedAt?: Date

  @AutoMap()
  planId?: number

  public GetFullName() : string {
    return `${this.firstName}${this.middleName ?? ` ${this.middleName}`}${this.lastName}`
  }
}

export const UsersColumns : KeysOf<Users> = {
  address_complement: sql.ident('address_complement'),
  address_number: sql.ident('address_number'),
  address_street: sql.ident('address_street'),
  city_id: sql.ident('city_id'),
  country_id: sql.ident('country_id'),
  created_at: sql.ident('created_at'),
  document_number: sql.ident('document_number'),
  email: sql.ident('email'),
  first_name: sql.ident('first_name'),
  id: sql.ident('id'),
  is_active: sql.ident('is_active'),
  last_name: sql.ident('last_name'),
  middle_name: sql.ident('middle_name'),
  neighbourhood: sql.ident('neighbourhood'),
  password: sql.ident('password'),
  phone_number_id: sql.ident('phone_number_id'),
  plan_id: sql.ident('plan_id'),
  postal_code: sql.ident('postal_code'),
  state_id: sql.ident('state_id'),
  updated_at: sql.ident('updated_at'),
  is_verified: sql.ident('is_verified'),
}

export class PartialUser implements Partial<User> {
  @AutoMap()
  id?: number

  @AutoMap()
  phoneNumberId ?: number

  @AutoMap()
  email?: string

  @AutoMap()
  password?: string

  @AutoMap()
  documentNumber?: string

  @AutoMap()
  firstName?: string

  @AutoMap()
  middleName?: string

  @AutoMap()
  lastName?: string

  @AutoMap()
  countryId?: number

  @AutoMap()
  stateId?: number

  @AutoMap()
  cityId?: number

  @AutoMap()
  neighbourhood?: string

  @AutoMap()
  addressStreet?: string

  @AutoMap()
  addressNumber?: string

  @AutoMap()
  addressComplement?: string

  @AutoMap()
  postalCode?: string

  @AutoMap()
  isVerified?: boolean

  @AutoMap()
  isActive?: boolean

  @AutoMap()
  createdAt?: Date

  @AutoMap()
  updatedAt?: Date

  @AutoMap()
  planId?: number
}
