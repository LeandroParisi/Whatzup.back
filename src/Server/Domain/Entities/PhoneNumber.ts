import { sql } from '@databases/pg'
import { KeysOf } from '../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { PhoneNumbers } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { BaseUpdatableEntity } from './BaseClasses/BaseEntity'

export default class PhoneNumber extends BaseUpdatableEntity {
  whatsappNumber : string

  whatsappId : string
}

export const PhoneNumberColumns : KeysOf<PhoneNumbers> = {
  created_at: sql.ident('created_at'),
  id: sql.ident('id'),
  is_active: sql.ident('is_active'),
  updated_at: sql.ident('updated_at'),
  whatsapp_id: sql.ident('whatsapp_id'),
  whatsapp_number: sql.ident('whatsapp_number'),
}
