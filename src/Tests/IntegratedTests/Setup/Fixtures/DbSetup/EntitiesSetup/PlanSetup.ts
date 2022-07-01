/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Plan from '../../../../../../Server/Domain/Entities/Plan'
import {
  Plans as PlansDbModel,
  Plans_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class PlanSetup extends BaseEntitySetup<Plan, PlansDbModel, Plans_InsertParameters> {
  table: TableHelper<PlansDbModel, Plans_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.plans
  }
}
