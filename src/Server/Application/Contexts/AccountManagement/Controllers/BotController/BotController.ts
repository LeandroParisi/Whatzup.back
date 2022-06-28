/* eslint-disable no-return-await */
import { sql } from '@databases/pg'
import {
  Body, HttpCode, JsonController, Post
} from 'routing-controllers'
import { Service } from 'typedi'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import Bot from '../../../../../Domain/Entities/Bot'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import ApiError from '../../../../Shared/Errors/ApiError'
import CreateBotRequest from './Requests/CreateBot/CreateBotRequest'

@Service()
@JsonController('/account-management/bot')
export default class BotController extends BaseCrudController<Bot> {
  /**
   *
   */
  constructor(
      private repository : BotRepository,
  ) {
    super(repository)
  }

  @HttpCode(201)
  @Post('')
  public async Create(@Body({ validate: { skipMissingProperties: true } }) body : CreateBotRequest) : Promise<Bot> {
    const created = await this.TryCreateBot(body)

    return created
  }

  private async TryCreateBot(body: CreateBotRequest) : Promise<Bot> {
    const self = this

    async function transaction() : Promise<Promise<Bot>> {
      return await PgTypedDbConnection.db.tx(async (db) => {
        const bot = Mapper.map(body, CreateBotRequest, Bot)
        const insertedBot = await self.repository.Create(bot, db)

        await db.query(sql`
          INSERT INTO users_bots VALUES (${body.userId}, ${insertedBot.id})
        `)

        return insertedBot
      })
    }

    try {
      return await transaction()
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to create bot.', e)
    }
  }
}
