import { sql } from '@databases/pg'
import { KeysOf } from '../../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { BotsPhoneNumbers as BotsPhoneNumbersDbModel } from '../../../Infrastructure/PgTyped/Schemas/__generated__'
import { BaseEntity } from '../BaseClasses/BaseEntity'

export default class BotsPhoneNumbers extends BaseEntity {
  botId : number

  phoneNumberId : number
}

export const BotsPhoneNumbersColumns : KeysOf<BotsPhoneNumbersDbModel> = {
  bot_id: sql.ident('bot_id'),
  phone_number_id: sql.ident('phone_number_id'),
}
