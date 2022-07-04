/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import PlanFeature from '../../../../../../Server/Domain/Entities/Pivot/PlanFeature'
import Plan from '../../../../../../Server/Domain/Entities/Plan'
import { PlansFeatures as PlansFeaturesTypesDbModel, PlansFeatures_InsertParameters } from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class PlansFeaturesSetup extends BaseEntitySetup<PlanFeature, PlansFeaturesTypesDbModel, PlansFeatures_InsertParameters> {
  table: TableHelper<PlansFeaturesTypesDbModel, PlansFeatures_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.plans_features
  }

  public async CreatePlanFeaturesRelation(
    featureIds : number[], plan : Plan, relation? : Partial<PlanFeature>,
  ) : Promise<void> {
    for (const featureId of featureIds) {
      if (relation) {
        await this.Create({ ...relation, planId: plan.id, featureId })
      } else {
        await this.Create({ planId: plan.id, featureId })
      }
    }
  }
}
