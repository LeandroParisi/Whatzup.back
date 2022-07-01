/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import FeatureType from '../../../../../../Server/Domain/Entities/FeatureType'
import { FeatureTypes as FeaturesTypesDbModel, FeatureTypes_InsertParameters } from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class FeatureTypeSetup extends BaseEntitySetup<FeatureType, FeaturesTypesDbModel, FeatureTypes_InsertParameters> {
  table: TableHelper<FeaturesTypesDbModel, FeatureTypes_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.feature_types
  }
}
