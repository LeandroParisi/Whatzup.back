import { sql } from '@databases/pg'
import { KeysOf } from '../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { Bots } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { BaseEntity } from './BaseClasses/BaseEntity'
import { Step } from './Steps/Step'

export default class Bot extends BaseEntity {
  readonly id : number

  readonly botName : string

  readonly steps : Step[]

  readonly userId : number

  readonly isActive : boolean

  readonly createdAt : Date

  readonly updatedAt : Date
}

export const BotColumns : KeysOf<Bots> = {
  bot_name: sql.ident('bot_name'),
  created_at: sql.ident('created_at'),
  id: sql.ident('id'),
  is_active: sql.ident('is_active'),
  steps: sql.ident('steps'),
  updated_at: sql.ident('updated_at'),
  user_id: sql.ident('user_id'),
}
