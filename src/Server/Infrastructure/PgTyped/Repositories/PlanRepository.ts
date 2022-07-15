/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Database/Repositories/IRepository'
import { CaseSerializer } from '../../../Application/Shared/Serializers/CaseSerializer'
import DetailedCustomPlanDTO from '../../../Domain/DTOs/DetailedPlanDTO'
import { FeatureDTO } from '../../../Domain/DTOs/FeatureDTO'
import { FeatureColumns } from '../../../Domain/Entities/Feature'
import { PlanFeaturesColumns } from '../../../Domain/Entities/Pivot/PlanFeature'
import Plan from '../../../Domain/Entities/Plan'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { Plans as PlanDbModel, Plans_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class PlanRepository extends BaseRepository<Plan, PlanDbModel, Plans_InsertParameters> {
  table: TableHelper<PlanDbModel, Plans_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor(table? : TableHelper<PlanDbModel, Plans_InsertParameters, 'defaultConnection'>) {
    super()
    this.table = table || PgTypedDbConnection.tables.plans
  }

  public async GetDetailedPlan(id : number, connection?: Connections): Promise<DetailedCustomPlanDTO> {
    const conn = connection || PgTypedDbConnection.db

    const plan = await this.table(conn).findOne({ id })

    if (!plan) return null

    const planFeatures = await this.GetPlanFeatures(plan.id, conn)

    const detailedPlan : DetailedCustomPlanDTO = {
      ...CaseSerializer.CastToCamel<PlanDbModel, Plan>(plan),
      features: planFeatures,
    }

    return detailedPlan
  }

  private async GetPlanFeatures(planId: number, conn: Connections) : Promise<FeatureDTO[]> {
    const planFeatures = await conn.query(sql`
      SELECT
        f.${FeatureColumns.id},
        f.${FeatureColumns.name} AS name,
        f.${FeatureColumns.type} AS type,
        pf.${PlanFeaturesColumns.max_limit}
      FROM plans_features AS pf
        INNER JOIN features AS f ON f.${FeatureColumns.id} = pf.${PlanFeaturesColumns.feature_id}
      WHERE pf.${PlanFeaturesColumns.plan_id} = ${planId}
    `)

    return CaseSerializer.CastArrayToCamel<any, FeatureDTO>(planFeatures)
  }
}
