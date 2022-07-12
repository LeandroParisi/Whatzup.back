/* eslint-disable no-underscore-dangle */
import { sql } from '@databases/pg'
import { Service } from 'typedi'
import { CaseSerializer } from '../../../../../Commons/Globals/Serializers/CaseSerializer'
import Bot from '../../../../../Domain/Entities/Bot'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import WhereQueryBuilder from '../../../../../Infrastructure/PgTyped/QueryBuilders/WhereQueryBuilder'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { Bots } from '../../../../../Infrastructure/PgTyped/Schemas/__generated__'
import BaseCrudServices from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'

@Service()
export class BotServices extends BaseCrudServices<Bot> {
/**
 *
 */
  constructor(
    private repository : BotRepository,
    private whereQueryBuilder : WhereQueryBuilder,
  ) {
    super(repository)
  }

  public async FindAll(query : Partial<Bot>) : Promise<Bot[]> {
    const cleanedEntity = this.CleanEntity(query)

    const whereQuery = this.whereQueryBuilder.BuildQuery(cleanedEntity, ['botName'])

    const queryString = sql.__dangerous__rawValue(`
      SELECT * FROM bots
      ${whereQuery}
    `)

    const bots = await PgTypedDbConnection.db.query(queryString) as Bots[]

    const serializedBots = CaseSerializer.CastArrayToCamel<Bots, Bot>(bots)

    return serializedBots
  }
}
