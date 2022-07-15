/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { anyOf, TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { CaseSerializer } from '../../../../../../Server/Application/Shared/Serializers/CaseSerializer'
import { PhoneNumberDTO } from '../../../../../../Server/Domain/DTOs/PhoneNumberDTO'
import PhoneNumber from '../../../../../../Server/Domain/Entities/PhoneNumber'
import {
  BotsPhoneNumbers,
  BotsPhoneNumbers_InsertParameters, PhoneNumbers as PhoneNumbersDbModel,
  PhoneNumbers_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import PhoneNumberMock from '../../../../../Shared/Mocks/PhoneNumberMock'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

export interface CreateXNumbersParams {
  randomNumbersToCreate? : number,
  numbers? : Partial<PhoneNumberDTO>[]
}

@Service()
export class PhoneNumberSetup extends BaseEntitySetup<PhoneNumber, PhoneNumbersDbModel, PhoneNumbers_InsertParameters> {
  table: TableHelper<PhoneNumbersDbModel, PhoneNumbers_InsertParameters, 'defaultConnection'>

  pivotTable : TableHelper<
    BotsPhoneNumbers, BotsPhoneNumbers_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.phone_numbers
    this.pivotTable = TestDbConnection.tables.bots_phone_numbers
  }

  public async InsertOne(params? : Partial<PhoneNumber>) : Promise<PhoneNumber> {
    const entity = params
      ? PhoneNumberMock.GetRandom(params)
      : PhoneNumberMock.GetRandom()

    const insertedBot = await this.Create(entity)

    return insertedBot
  }

  public async FindAllByBotId(botId : number) : Promise<PhoneNumber[]> {
    const phoneNumberIds = await this.pivotTable(this.connection).find({ bot_id: botId }).all()

    const phoneNumbers = await this.table(this.connection)
      .find({
        id: anyOf(phoneNumberIds.map((p) => p.phone_number_id)),
      })
      .all()

    return CaseSerializer.CastArrayToCamel<PhoneNumbersDbModel, PhoneNumber>(phoneNumbers)
  }

  public async CreateXNumbers({ randomNumbersToCreate, numbers } : CreateXNumbersParams) : Promise<PhoneNumber[]> {
    const output : PhoneNumber[] = []

    if (numbers?.length) {
      for (const f of numbers) {
        const number = await this.InsertOne(f)
        output.push(number)
      }
    }

    if (randomNumbersToCreate) {
      for (let i = 1; i <= randomNumbersToCreate; i += 1) {
        const number = await this.InsertOne()
        output.push(number)
      }
    }

    return output
  }
}
