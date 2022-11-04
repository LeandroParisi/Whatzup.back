import { faker } from '@faker-js/faker'
import { assert } from 'chai'
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

  it('1. Should return proper plan DTO', async () => {
    // Arrange
    const { plan, features } = await dbSetup.FullPlanSetup({})
    await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    // Act
    const foundDetailedPlan = await planRepository.GetDetailedPlan(plan.id)

    // Assert
    expect(foundDetailedPlan).not.toBeNull()
    assert.deepEqual(features.map((f) => f.id), foundDetailedPlan.features.map((f) => f.id))
    assert.equal(foundDetailedPlan.id, plan.id)
  })

  it('2. Should return null if plan does not exist', async () => {
    // Act
    const foundDetailedPlan = await planRepository.GetDetailedPlan(faker.datatype.number())

    // Assert
    expect(foundDetailedPlan).toBeNull()
  })
})
