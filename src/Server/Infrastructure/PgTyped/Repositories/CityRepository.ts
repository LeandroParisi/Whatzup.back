/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import City from '../../../Domain/Entities/City'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import Cities, { Cities_InsertParameters } from '../Schemas/__generated__/cities'
import { BaseRepository } from './BaseRepository'

@Service()
export class CityRepository extends BaseRepository<City, Cities, Cities_InsertParameters> {
  table: TableHelper<Cities, Cities_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.cities
  }
}
