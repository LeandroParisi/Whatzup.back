/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import BotsPhoneNumbers from '../../../../../../Server/Domain/Entities/Pivot/BotsPhoneNumbers'
import { BotsPhoneNumbers as BotsPhoneNumbersTypesDbModel, BotsPhoneNumbers_InsertParameters } from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class BotsPhoneNumbersSetup extends BaseEntitySetup<BotsPhoneNumbers, BotsPhoneNumbersTypesDbModel, BotsPhoneNumbers_InsertParameters> {
  table: TableHelper<BotsPhoneNumbersTypesDbModel, BotsPhoneNumbers_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.bots_phone_numbers
  }

  public async CreateRelation(
    botId : number, phoneNumberId : number,
  ) : Promise<void> {
    await this.Create({ botId, phoneNumberId })
  }

  public async CreateXRelations(botId : number, phoneNumbersIds : number[]) : Promise<void> {
    for (const phoneNumberId of phoneNumbersIds) {
      await this.CreateRelation(botId, phoneNumberId)
    }
  }

  async CleanUp() : Promise<void> {
    for (const entity of this.EntitiesToDispose) {
      await this.PreCleanUp(entity)
      await this.table(TestDbConnection.db).delete({ bot_id: entity.botId, phone_number_id: entity.phoneNumberId })
    }
  }
}
