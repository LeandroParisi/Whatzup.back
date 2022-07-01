import { PlanRepository } from '../../../../../../Server/Infrastructure/PgTyped/Repositories/PlanRepository'
import DbSetup from '../../../../Setup/Fixtures/DbSetup/DbSetup'

describe('User Plan repository integrated tests', () => {
  let dbSetup : DbSetup
  let planRepository : PlanRepository

  beforeEach(() => {
    dbSetup = new DbSetup()
    planRepository = new PlanRepository()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
  })

  // it('1. Should return proper plan DTO', async () => {
  //   const insertedPlan = await dbSetup.FullPlanSetup({})
  //   const insertedUser = await dbSetup.BasicUserSetup({ user: { planId: insertedPlan.id } })

  //   const plan = await planRepository.GetDetailedPlan(insertedPlan.id)

  //   console.log({ plan })
  // })

  it('2. Should return null if plan does not exist', () => {})

  it('3. Should return plan with all its features', () => {})
})
