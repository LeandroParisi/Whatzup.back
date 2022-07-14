import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
import PlanMock from '../../../../../../../Shared/Mocks/PlanMock'
import UserMock from '../../../../../../../Shared/Mocks/UserMock'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'
import BotControllerStubs from './BotControllerStubs'

describe('Bot controller: Create - Integrated Tests', () => {
  let app : express.Express
  let dbSetup : DbSetup

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  beforeAll(() => {
    const server = new Server()
    server.Start()
    app = server.App
  })

  beforeEach(() => {
    dbSetup = new DbSetup()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
  })

  it('1. Should properlly create bot', async () => {
    // Arrange
    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())
    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })
    const body = BotControllerStubs.GetValidPayload()
    const token = JwtMocks.GetToken({ email: user.email, id: user.id })

    // Act
    const response = await request(app)
      .post(`/api/${BaseRoutes.AccountManagementBot}`)
      .set('authorization', token)
      .send(body)

    // Assert
    const createdBot = await dbSetup.botSetup.FindOne({ botName: body.botName })

    expect(createdBot).not.toBeNull()
    expect(response.status).toBe(StatusCode.CREATED)
  })

  it('2. Should not create bot if user does not exist', async () => {
    // Arrange
    const payload = BotControllerStubs.GetValidPayload()
    const { email, id } = UserMock.GetRandomUser(1, 1, 1, 1)
    const token = JwtMocks.GetToken({ email, id })

    // Act
    const response = await request(app)
      .post(`/api/${BaseRoutes.AccountManagementBot}`)
      .set('authorization', token).send(payload)

    // Assert
    const createdBot = await dbSetup.botSetup.FindOne({ botName: payload.botName })

    expect(createdBot).toBeNull()
    assert.equal(response.status, StatusCode.NOT_FOUND)
  })

  theoretically(
    '3. Should not accept request with invalid data',
    BotControllerStubs.GetInvalidCreatePayload(),
    async (theory) => {
      // Arrange
      const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())
      const { user: { email, id } } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })
      const token = JwtMocks.GetToken({ email, id })
      const body = {
        ...theory,
        botName: theory.botName !== null ? faker.name.findName() : null,
      }

      // Act
      const response = await request(app)
        .post(`/api/${BaseRoutes.AccountManagementBot}`)
        .set('authorization', token).send(body)

      // Assert
      const createdBot = await dbSetup.botSetup.FindOne({ botName: theory.botName })

      assert.equal(response.status, StatusCode.BAD_REQUEST)
      expect(createdBot).toBeNull()
    },
  )
})
