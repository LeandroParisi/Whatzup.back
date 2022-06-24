/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Country from '../../../Domain/Entities/Country'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { Countries as CountriesDbModel, Countries_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class CountryRepository extends BaseRepository<Country, CountriesDbModel, Countries_InsertParameters> {
  table: TableHelper<CountriesDbModel, Countries_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.countries
  }
}
