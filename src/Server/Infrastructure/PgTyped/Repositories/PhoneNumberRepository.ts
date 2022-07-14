/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Database/Repositories/IRepository'
import BotPhoneCountDTO from '../../../Domain/DTOs/BotPhoneCountDTO'
import { BotColumns } from '../../../Domain/Entities/Bot'
import PhoneNumber from '../../../Domain/Entities/PhoneNumber'
import { BotsPhoneNumbersColumns } from '../../../Domain/Entities/Pivot/BotsPhoneNumbers'
import { UsersColumns } from '../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import {
  BotsPhoneNumbers,
  BotsPhoneNumbers_InsertParameters, PhoneNumbers as PhoneNumbersDbModel,
  PhoneNumbers_InsertParameters,
} from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

export interface GetBotsPhoneCountByUserReturn {
  botsPhoneCount : BotPhoneCountDTO[]
  maxPhoneCount : number
}

@Service()
export class PhoneNumberRepository extends BaseRepository<PhoneNumber, PhoneNumbersDbModel, PhoneNumbers_InsertParameters> {
  table: TableHelper<PhoneNumbersDbModel, PhoneNumbers_InsertParameters, 'defaultConnection'>

  pivotTable : TableHelper<
    BotsPhoneNumbers, BotsPhoneNumbers_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor(table? : TableHelper<PhoneNumbersDbModel, PhoneNumbers_InsertParameters, 'defaultConnection'>) {
    super()
    this.table = table || PgTypedDbConnection.tables.phone_numbers
    this.pivotTable = PgTypedDbConnection.tables.bots_phone_numbers
  }

  public async CountPhoneNumbersByBot(botId : number, conn? : Connections) : Promise<number> {
    const dbConnection = conn || PgTypedDbConnection.db

    const count = await this.pivotTable(dbConnection).count({ bot_id: botId })

    return count
  }

  public async GetBotsPhoneCountByUser(userId : number, conn? : Connections) : Promise<GetBotsPhoneCountByUserReturn> {
    const dbConnection = conn || PgTypedDbConnection.db

    const botsPhoneCount = await dbConnection.query(sql`
      SELECT
        bfn.bot_id AS "botId",
        COUNT(bfn.bot_id) as "phoneCount" 
      FROM users AS u
        INNER JOIN bots AS b ON u.${UsersColumns.id} = b.${BotColumns.user_id}
        INNER JOIN bots_phone_numbers AS bfn ON bfn.${BotsPhoneNumbersColumns.bot_id} = b.${BotColumns.id}
      WHERE u.id = ${userId} AND b.${BotColumns.is_active} = TRUE
      GROUP BY bfn.${BotsPhoneNumbersColumns.bot_id}
    `) as BotPhoneCountDTO[]

    return {
      botsPhoneCount,
      maxPhoneCount: Math.max(...botsPhoneCount.map((x) => Number(x.phoneCount))),
    }
  }
}
