/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import State from '../../../../../../Server/Domain/Entities/State'
import {
  States as StatesDbModel,
  States_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class StateSetup extends BaseEntitySetup<State, StatesDbModel, States_InsertParameters> {
  table: TableHelper<StatesDbModel, States_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.states
  }
}
