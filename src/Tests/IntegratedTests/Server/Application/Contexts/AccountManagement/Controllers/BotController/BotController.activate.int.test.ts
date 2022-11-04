import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import express from 'express'
import BaseResponse from '../../../../../../../../Server/Application/Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ResponseMessages } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import Feature from '../../../../../../../../Server/Domain/Entities/Feature'
import Plan from '../../../../../../../../Server/Domain/Entities/Plan'
import User from '../../../../../../../../Server/Domain/Entities/User'
import { FeatureNames } from '../../../../../../../../Server/Domain/Enums/FeatureNames'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
import BaseActivateDeactivateRouteTests from '../../../../../../Setup/Fixtures/BaseTests/BaseActivateDeactivateRouteTest'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'
import { FeatureSetup } from '../../../../../../Setup/Fixtures/DbSetup/EntitiesSetup/FeatureSetup'

class ActivateBotFixture extends BaseActivateDeactivateRouteTests {
  user : User

  bot : Bot

  plan : Plan

  features : Feature[]

  /**
   *
   */
  constructor(dbSetup : DbSetup) {
    super(BaseRoutes.AccountManagementBot, 'activate', dbSetup)
  }

  async Arrange(isActive : boolean) {
    const {
      user, bot, plan, features,
    } = await this.dbSetup.BasicUserBotSetupWithPlan(null)

    await this.dbSetup.botSetup.UpdateOne({ id: bot.id }, { isActive })
    this.user = user
    this.bot = await this.dbSetup.botSetup.FindOne({ id: bot.id })
    this.plan = plan
    this.features = features

    this.token = JwtMocks.GetToken({ email: user.email, id: user.id })

    this.entityId = bot.id
  }

  async AssertEntityState(isActive : boolean) {
    const currentBot = await this.dbSetup.botSetup.FindOne({ id: this.bot.id })

    expect(currentBot).not.toBeNull()
    assert.deepEqual({ ...this.bot, isActive }, currentBot)
  }

  async CleanUp() {
    this.user = null
    this.bot = null
    this.plan = null
    this.features = null
    await this.dbSetup.CleanUp()
  }
}

describe('Bot controller activate integrated test', () => {
  let app : express.Express
  let dbSetup : DbSetup
  let Fixture : ActivateBotFixture

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  beforeAll(() => {
    const server = new Server()
    server.Start()
    app = server.App
  })

  beforeEach(() => {
    dbSetup = new DbSetup()
    Fixture = new ActivateBotFixture(dbSetup)
  })

  afterEach(async () => {
    await Fixture.CleanUp()
    await dbSetup.CleanUp()
  })

  it('1. Should properlly activate entity if it is deactivated', async () => {
    await Fixture.Arrange(false)

    await Fixture.Act(app)

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.OK)
    await Fixture.AssertEntityState(true)
  })

  it('2. Should not activate entity if it is already activated', async () => {
    await Fixture.Arrange(true)

    const maxBotFeature = Fixture.features.find((x) => x.name === FeatureNames.NumberOfBots)

    await Fixture.dbSetup.plansFeaturesSetup.UpdateOne(
      { planId: Fixture.plan.id, featureId: maxBotFeature.id },
      { maxLimit: FeatureSetup.NUMBER_OF_BOTS_FEATURE.limit + 1 },
    )

    await Fixture.Act(app)

    const { message } = Fixture.response.body as BaseResponse

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.OK)
    expect(message).not.toBe(ResponseMessages.UpdatedSuccessfully)

    await Fixture.AssertEntityState(true)
  })

  it('3. Should throw an error if entity does not exist', async () => {
    await Fixture.Arrange(false)
    Fixture.entityId += faker.datatype.number({ min: 10000, max: 50000 })

    await Fixture.Act(app)

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.NOT_FOUND)
  })

  it('4. Should throw an error if user does not exist', async () => {
    await Fixture.Arrange(false)
    Fixture.token = JwtMocks.GetToken({ email: faker.internet.email(), id: faker.datatype.number({ min: 100000 }) })

    await Fixture.Act(app)

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.NOT_FOUND)
  })

  it('5. Should not activate bot if user plan would be violated', async () => {
    await Fixture.Arrange(false)
    await Fixture.dbSetup.botSetup.InsertOne({ userId: Fixture.user.id, isActive: true })

    await Fixture.Act(app)

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.FORBIDDEN)
    await Fixture.AssertEntityState(false)
  })
})
