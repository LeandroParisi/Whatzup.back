/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Repositories/IRepository'
import { CaseSerializer } from '../../../Commons/Globals/Serializers/CaseSerializer'
import DetailedCustomPlanDTO from '../../../Domain/DTOs/DetailedCustomPlanDTO'
import { FeatureDTO } from '../../../Domain/DTOs/FeatureDTO'
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
        f.id,
        f.name AS name,
        ft.name AS type,
        pf.max_limit
      FROM plans_features AS pf
        INNER JOIN features AS f ON f.id = pf.feature_id
        INNER JOIN feature_types AS ft ON f.type_id = ft.id
      WHERE pf.plan_id = ${planId}
    `)

    return CaseSerializer.CastArrayToCamel<any, FeatureDTO>(planFeatures)
  }
}
