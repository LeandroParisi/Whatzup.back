/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Country from '../../../../../../Server/Domain/Entities/Country'
import {
  Countries as CountriesDbModel,
  Countries_InsertParameters
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class CountrySetup extends BaseEntitySetup<Country, CountriesDbModel, Countries_InsertParameters> {
  table: TableHelper<CountriesDbModel, Countries_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.countries
  }
}
