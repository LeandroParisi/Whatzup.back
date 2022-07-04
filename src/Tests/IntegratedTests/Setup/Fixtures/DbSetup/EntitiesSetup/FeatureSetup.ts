/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import Feature from '../../../../../../Server/Domain/Entities/Feature'
import { FeatureNames } from '../../../../../../Server/Domain/Enums/FeatureNames'
import { FeatureTypes } from '../../../../../../Server/Domain/Enums/FeatureTypes'
import {
  Features as FeaturesDbModel,
  Features_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import FeatureMock from '../../../../../Shared/Mocks/FeatureMock'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

export interface BasicFeature {
  feature : Partial<Feature>
  limit: number
}

@Service()
export class FeatureSetup extends BaseEntitySetup<Feature, FeaturesDbModel, Features_InsertParameters> {
  table: TableHelper<FeaturesDbModel, Features_InsertParameters, 'defaultConnection'>

  static NUMBER_OF_BOTS_FEATURE : BasicFeature= {
    feature: { name: FeatureNames.NumberOfBots, type: FeatureTypes.MaxLimit },
    limit: 1,
  }

  static MAX_STEPS_FEATURE : BasicFeature= {
    feature: { name: FeatureNames.NumberOfSteps, type: FeatureTypes.MaxLimit },
    limit: 4,
  }

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.features
  }

  public async InsertOneFeature(params? : Partial<Feature>) : Promise<Feature> {
    const feature = params
      ? FeatureMock.GetRandom(params)
      : FeatureMock.GetRandom()

    const insertedfeature = await this.Create(feature)

    return insertedfeature
  }

  public async CreateXFeatures(totalFeaturesToCreate : number, features? : Partial<Feature>[]) : Promise<Feature[]> {
    const output : Feature[] = []

    if (features?.length) {
      for (const f of features) {
        const feature = await this.InsertOneFeature(f)
        output.push(feature)
      }
    }

    const extraFeatures = totalFeaturesToCreate - features?.length

    for (let i = 1; i <= extraFeatures; i += 1) {
      const feature = await this.InsertOneFeature()
      output.push(feature)
    }

    return output
  }
}
