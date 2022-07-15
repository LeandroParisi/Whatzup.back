/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { anyOf, TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Database/Repositories/IRepository'
import { CaseSerializer } from '../../../Application/Shared/Serializers/CaseSerializer'
import BotPhoneCountDTO from '../../../Domain/DTOs/BotPhoneCountDTO'
import { PhoneNumberDTO } from '../../../Domain/DTOs/PhoneNumberDTO'
import { BotColumns } from '../../../Domain/Entities/Bot'
import PhoneNumber, { PhoneNumberColumns } from '../../../Domain/Entities/PhoneNumber'
import { BotsPhoneNumbersColumns } from '../../../Domain/Entities/Pivot/BotsPhoneNumbers'
import { UsersColumns } from '../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import WhereQueryBuilder from '../QueryBuilders/WhereQueryBuilder'
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
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.phone_numbers
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

  public async TryInsertBotPhoneNumbers(phoneNumbers : PhoneNumberDTO[], botId : number, conn? : Connections) {
    const dbConnection = conn || PgTypedDbConnection.db

    const alreadyVinculatedPhoneNumbers = await this.GetVinculatedPhones(phoneNumbers, botId, dbConnection)

    const phonesToVinculate = phoneNumbers
      .filter((p) => !new Set([...alreadyVinculatedPhoneNumbers.map((x) => x.whatsappNumber)]).has(p.whatsappNumber))

    await this.TryCreateBotPhoneNumbers(phonesToVinculate, botId, dbConnection)
  }

  public async TryCreateBotPhoneNumbers(phoneNumbers : PhoneNumberDTO[], botId : number, conn? : Connections) {
    const dbConnection = conn || PgTypedDbConnection.db

    const insertedIds = await this.TryCreatePhoneNumbers(phoneNumbers, dbConnection)

    const pivotEntriesToInsert : Partial<BotsPhoneNumbers[]> = insertedIds.map((i) => ({
      bot_id: botId,
      phone_number_id: i,
    }))

    await this.pivotTable(conn).insert(...pivotEntriesToInsert)
  }

  private async TryCreatePhoneNumbers(phoneNumbers: PhoneNumberDTO[], conn : Connections) : Promise<number[]> {
    let phoneNumbersToInsert = [...phoneNumbers]
    let insertedIds : number[] = []

    const alreadyCreatedPhoneNumbers = await this.table(conn)
      .find({
        whatsapp_number: anyOf(phoneNumbersToInsert.map((p) => p.whatsappNumber)),
      })
      .select('id', 'whatsapp_number')
      .all()

    const alreadyInsertedNumbers = new Set([...alreadyCreatedPhoneNumbers.map((p) => p.whatsapp_number)])

    if (alreadyInsertedNumbers.size) {
      phoneNumbersToInsert = phoneNumbersToInsert.filter((p) => !alreadyInsertedNumbers.has(p.whatsappNumber))
      insertedIds = alreadyCreatedPhoneNumbers.map((p) => p.id)
    }

    const newInsertedPhones = await this.table(conn)
      .insert(...CaseSerializer.CastArrayToSnake<PhoneNumberDTO, PhoneNumbers_InsertParameters>(phoneNumbersToInsert))

    insertedIds.push(...newInsertedPhones.map((p) => p.id))

    return insertedIds
  }

  private async GetVinculatedPhones(phoneNumbers: PhoneNumberDTO[], botId : number, conn : Connections) {
    const inSet = WhereQueryBuilder.BuildInSet(phoneNumbers.map((p) => p.whatsappNumber))

    const alreadyVinculatedPhoneNumbers = await conn.query(sql`
      SELECT pn.${PhoneNumberColumns.whatsapp_number} AS "whatsappNumber"
        FROM bots_phone_numbers AS bpn
        INNER JOIN phone_numbers AS pn ON pn.${PhoneNumberColumns.id} = bpn.${BotsPhoneNumbersColumns.phone_number_id}
      WHERE bpn.${BotsPhoneNumbersColumns.bot_id} = ${botId}
        AND pn.${PhoneNumberColumns.whatsapp_number} IN ${inSet}
    `) as [{whatsappNumber : string}]

    return alreadyVinculatedPhoneNumbers
  }
}
