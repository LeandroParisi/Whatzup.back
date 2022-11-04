/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Database/Repositories/IRepository'
import BotPhoneCountDTO from '../../../Domain/DTOs/BotPhoneCountDTO'
import BotsPhoneNumbers, { BotsPhoneNumbersColumns } from '../../../Domain/Entities/Pivot/BotsPhoneNumbers'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import WhereQueryBuilder from '../QueryBuilders/WhereQueryBuilder'
import {
  BotsPhoneNumbers as BotsPhoneNumbersDbModel,
  BotsPhoneNumbers_InsertParameters,
} from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

export interface GetBotsPhoneCountByUserReturn {
  botsPhoneCount : BotPhoneCountDTO[]
  maxPhoneCount : number
}

@Service()
export class BotPhoneNumberRepository extends BaseRepository<
  BotsPhoneNumbers, BotsPhoneNumbersDbModel, BotsPhoneNumbers_InsertParameters
> {
  table : TableHelper<
    BotsPhoneNumbersDbModel,
    BotsPhoneNumbers_InsertParameters,
    'defaultConnection'
  >

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.bots_phone_numbers
  }

  public async DeleteRelationsExcept(botId : number, phoneNumberIds : number[], conn? : Connections) {
    const dbConnection = conn || PgTypedDbConnection.db

    const inSet = WhereQueryBuilder.BuildInSet(phoneNumberIds)

    await dbConnection.query(sql`
      DELETE FROM bots_phone_numbers
        WHERE ${BotsPhoneNumbersColumns.bot_id} = ${botId}
        AND ${BotsPhoneNumbersColumns.phone_number_id} NOT IN ${inSet}
    `)
  }
}
