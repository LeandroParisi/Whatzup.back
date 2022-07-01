import { KeysEnum } from '../../Commons/Interfaces/SystemInterfaces/KeysEnum'
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

export const FeatureColumns : KeysEnum<Features> = {
  id: 'id',
  created_at: 'created_at',
  is_active: 'is_active',
  name: 'name',
  type: 'type',
  updated_at: 'updated_at',
}
