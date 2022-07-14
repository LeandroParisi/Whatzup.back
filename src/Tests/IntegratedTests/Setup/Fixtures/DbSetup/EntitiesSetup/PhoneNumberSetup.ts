/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import PhoneNumber from '../../../../../../Server/Domain/Entities/PhoneNumber'
import {
  PhoneNumbers as PhoneNumbersDbModel,
  PhoneNumbers_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import PhoneNumberMock from '../../../../../Shared/Mocks/PhoneNumberMock'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class PhoneNumberSetup extends BaseEntitySetup<PhoneNumber, PhoneNumbersDbModel, PhoneNumbers_InsertParameters> {
  table: TableHelper<PhoneNumbersDbModel, PhoneNumbers_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.phone_numbers
  }

  public async InsertOne(params? : Partial<PhoneNumber>) : Promise<PhoneNumber> {
    const entity = params
      ? PhoneNumberMock.GetRandom(params)
      : PhoneNumberMock.GetRandom()

    const insertedBot = await this.Create(entity)

    return insertedBot
  }
}
