/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Bot from '../../../Domain/Entities/Bot'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { Bots, Bots_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class BotRepository extends BaseRepository<Bot, Bots, Bots_InsertParameters> {
  table: TableHelper<Bots, Bots_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.bots
  }
}
