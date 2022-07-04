/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Bot from '../../../../../../Server/Domain/Entities/Bot'
import {
  Bots as BotDbModel,
  Bots_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import BotMock from '../../../../../Shared/Mocks/BotMock'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class BotSetup extends BaseEntitySetup<Bot, BotDbModel, Bots_InsertParameters> {
  table: TableHelper<BotDbModel, Bots_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.bots
  }

  public async InsertOne(params? : Partial<Bot>) : Promise<Bot> {
    const bot = params
      ? BotMock.GetRandom(params)
      : BotMock.GetRandom()

    const insertedBot = await this.Create(bot)

    return insertedBot
  }
}
