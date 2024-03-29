/* eslint-disable no-underscore-dangle */
import { sql } from '@databases/pg'
import Container, { Service } from 'typedi'
import BaseCrudServices from '../../Application/Shared/APIs/BaseClasses/BaseCrudServices'
import { ErrorMessages } from '../../Application/Shared/APIs/Enums/Messages'
import { StatusCode } from '../../Application/Shared/APIs/Enums/Status'
import { CaseSerializer } from '../../Application/Shared/Serializers/CaseSerializer'
import EntityCleaning from '../../Application/Shared/Serializers/EntityCleaning'
import { PgTypedDbConnection } from '../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import WhereQueryBuilder from '../../Infrastructure/PgTyped/QueryBuilders/WhereQueryBuilder'
import { BotPhoneNumberRepository } from '../../Infrastructure/PgTyped/Repositories/BotPhoneNumberRepository'
import { BotRepository } from '../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PhoneNumberRepository } from '../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { Bots } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { PhoneNumberDTO } from '../DTOs/PhoneNumberDTO'
import Bot from '../Entities/Bot'
import ApiError from '../Errors/ApiError'

@Service()
export class BotCrudServices extends BaseCrudServices<Bot> {
/**
 *
 */
  constructor(
    private phoneNumberRepository : PhoneNumberRepository,
    private botPhoneNumberRepository : BotPhoneNumberRepository,
  ) {
    super(Container.get(BotRepository))
  }

  public async FindAll(query : Partial<Bot>) : Promise<Bot[]> {
    const cleanedQuery = EntityCleaning.CleanEntity(query)

    const whereQuery = WhereQueryBuilder.BuildWhereStatement(cleanedQuery, ['botName'])

    const queryString = sql.__dangerous__rawValue(`
      SELECT * FROM bots
      ${whereQuery}
    `)

    const bots = await PgTypedDbConnection.db.query(queryString) as Bots[]

    const serializedBots = CaseSerializer.CastArrayToCamel<Bots, Bot>(bots)

    return serializedBots
  }

  public async Update(query : Partial<Bot>, botInfoToUpdate : Partial<Bot>, phoneNumbers? : PhoneNumberDTO[]) {
    const self = this
    const { id: botId } = query

    async function transaction() : Promise<boolean> {
      let isBotUpdated = false

      await PgTypedDbConnection.db.tx(async (db) => {
        isBotUpdated = await self.Repository.UpdateOne(query, botInfoToUpdate, db)

        if (phoneNumbers) {
          const botPhoneIds = await self.phoneNumberRepository.TryInsertBotPhoneNumbers(phoneNumbers, botId, db)
          await self.botPhoneNumberRepository.DeleteRelationsExcept(botId, botPhoneIds)
        }
      })

      return isBotUpdated
    }

    try {
      const isUpdated = await transaction()
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, e)
    }
  }
}
