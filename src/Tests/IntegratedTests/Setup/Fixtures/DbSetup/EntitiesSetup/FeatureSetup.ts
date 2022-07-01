/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Feature from '../../../../../../Server/Domain/Entities/Feature'
import {
  Features as FeaturesDbModel,
  Features_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class FeatureSetup extends BaseEntitySetup<Feature, FeaturesDbModel, Features_InsertParameters> {
  table: TableHelper<FeaturesDbModel, Features_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.features
  }
}
