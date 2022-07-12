import { sql } from '@databases/pg'
import { KeysOf } from '../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { Features } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { FeatureNames } from '../Enums/FeatureNames'
import { FeatureTypes } from '../Enums/FeatureTypes'
import { BaseEntity } from './BaseClasses/BaseEntity'

export default class Feature extends BaseEntity {
  id : number

  type : FeatureTypes

  name : FeatureNames

  isActive : boolean

  createdAt : Date

  updatedAt : Date
}

export const FeatureColumns : KeysOf<Features> = {
  id: sql.ident('id'),
  created_at: sql.ident('created_at'),
  is_active: sql.ident('is_active'),
  name: sql.ident('name'),
  type: sql.ident('type'),
  updated_at: sql.ident('updated_at'),
}
