import { sql } from '@databases/pg'
import { KeysOf } from '../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { PlansFeatures } from '../../../Infrastructure/PgTyped/Schemas/__generated__'
import { BaseEntity } from '../BaseClasses/BaseEntity'

export default class PlanFeature extends BaseEntity {
  planId : number

  featureId : number

  maxLimit? : number

  isActive : boolean

  createdAt : Date

  updatedAt : Date
}

export const PlanFeaturesColumns : KeysOf<PlansFeatures> = {
  feature_id: sql.ident('feature_id'),
  max_limit: sql.ident('max_limit'),
  plan_id: sql.ident('plan_id'),
}
