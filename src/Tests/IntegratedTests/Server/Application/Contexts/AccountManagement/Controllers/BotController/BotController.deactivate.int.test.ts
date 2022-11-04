import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import express from 'express'
import BaseResponse from '../../../../../../../../Server/Application/Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ResponseMessages } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
import BaseActivateDeactivateRouteTests from '../../../../../../Setup/Fixtures/BaseTests/BaseActivateDeactivateRouteTest'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'

class ActivateBotFixture extends BaseActivateDeactivateRouteTests {
  bot : Bot

  /**
   *
   */
  constructor(dbSetup : DbSetup) {
    super(BaseRoutes.AccountManagementBot, 'deactivate', dbSetup)
  }

  async Arrange(isActive : boolean) {
    const { user } = await this.dbSetup.BasicUserSetup()
    const bot = await this.dbSetup.botSetup.InsertOne({ userId: user.id })
    await this.dbSetup.botSetup.UpdateOne({ userId: user.id }, { isActive })
    this.bot = bot

    this.token = JwtMocks.GetToken({ email: user.email, id: user.id })

    this.entityId = bot.id
  }

  async AssertEntityState(isActive : boolean) {
    const currentBot = await this.dbSetup.botSetup.FindOne({ id: this.bot.id })

    expect(currentBot).not.toBeNull()
    assert.deepEqual({ ...this.bot, isActive }, currentBot)
  }
}

describe('Bot controller deactivate integrated test', () => {
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
    await dbSetup.CleanUp()
  })

  it('1. Should properlly deactivate entity if it is activated', async () => {
    await Fixture.Arrange(true)

    await Fixture.Act(app)

    const { message } = Fixture.response.body as BaseResponse

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.OK)
    expect(message).toBe(ResponseMessages.UpdatedSuccessfully)
    await Fixture.AssertEntityState(false)
  })

  it('2. Should not deactivate entity if it is already deactivated', async () => {
    await Fixture.Arrange(false)

    await Fixture.Act(app)

    const { message } = Fixture.response.body as BaseResponse

    expect(Fixture.response).not.toBeNull()
    expect(Fixture.response.status).toBe(StatusCode.OK)
    expect(message).not.toBe(ResponseMessages.UpdatedSuccessfully)
    await Fixture.AssertEntityState(false)
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
})
