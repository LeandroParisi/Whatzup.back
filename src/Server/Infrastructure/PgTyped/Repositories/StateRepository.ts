/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import State from '../../../Domain/Entities/State'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { States as StatesDbModel, States_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class StateRepository extends BaseRepository<State, StatesDbModel, States_InsertParameters> {
  table: TableHelper<StatesDbModel, States_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.states
  }
}
