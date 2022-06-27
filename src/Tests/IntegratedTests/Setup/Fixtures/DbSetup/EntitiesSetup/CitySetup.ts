/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import City from '../../../../../../Server/Domain/Entities/City'
import {
  Cities as CityDbModel,
  Cities_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class CitySetup extends BaseEntitySetup<City, CityDbModel, Cities_InsertParameters> {
  table: TableHelper<CityDbModel, Cities_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.cities
  }
}
