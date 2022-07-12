/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import User from '../../../../../../../../Server/Domain/Entities/User'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
import PlanMock from '../../../../../../../Shared/Mocks/PlanMock'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'

describe('Bot controller: FindAll - Integrated Tests', () => {
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

  const theories = [
    { includeBotNameOnQuery: false },
    { includeBotNameOnQuery: true },

  ]

  theoretically(
    '1. Should properlly get all bots, query with botname {includeBotNameOnQuery}',
    theories,
    async ({ includeBotNameOnQuery }) => {
    // Arrange
      const botsRelatedToUserToInsert = faker.datatype.number({ max: 10 })
      const botsUnRelatedToUserToInsert = faker.datatype.number({ max: 10 })

      const {
        token,
        bots,
      // user,
      } = await Setup(botsRelatedToUserToInsert, botsUnRelatedToUserToInsert)

      const [firstBot] = bots

      const query = includeBotNameOnQuery ? `?botName=${firstBot.botName}` : ''

      // Act
      const response = await request(app)
        .get(`/api/${BaseRoutes.AccountManagementBot}${query}`)
        .set('authorization', token)

      // Assert
      expect(response.status).toBe(StatusCode.OK)
      expect(response.body).not.toBeNull()

      await VerifyResult(bots, response.body, includeBotNameOnQuery)
    },
  )

  theoretically('2. Should return empty array if no bots are found', theories, async ({ includeBotNameOnQuery }) => {
    // Arrange
    const botsRelatedToUserToInsert = includeBotNameOnQuery ? faker.datatype.number({ max: 10 }) : 0
    const botsUnRelatedToUserToInsert = faker.datatype.number({ max: 10 })

    const { token } = await Setup(botsRelatedToUserToInsert, botsUnRelatedToUserToInsert)

    const query = includeBotNameOnQuery ? `?botName=${faker.name.findName('INT TESTES')}` : ''

    // Act
    const response = await request(app)
      .get(`/api/${BaseRoutes.AccountManagementBot}${query}`)
      .set('authorization', token)

    // Assert
    expect(response.status).toBe(StatusCode.OK)
    expect(response.body).not.toBeNull()
    expect(response.body.length).toBe(0)
  })

  it('3. Should not get bots if user does not exist', async () => {
    // Arrange
    const { user } = await dbSetup.BasicUserSetup()

    const token = JwtMocks
      .GetToken({ email: faker.internet.email(), id: user.id + faker.datatype.number({ min: 500, max: 2500 }) })

    // Act
    const response = await request(app)
      .get(`/api/${BaseRoutes.AccountManagementBot}`)
      .set('authorization', token)

    // Assert
    expect(response.status).toBe(StatusCode.NOT_FOUND)
  })

  async function Setup(
    botsRelatedToUserToInsert : number, botsUnRelatedToUserToInsert : number,
  ) : Promise<{user : User, bots : Bot[], token : string}> {
    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())
    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    const bots : Bot[] = []

    for (let i = 1; i <= botsRelatedToUserToInsert; i += 1) {
      bots.push(await dbSetup.botSetup.InsertOne({ userId: user.id }))
    }

    await InsertAnotherUserSetup(botsUnRelatedToUserToInsert)

    const token = JwtMocks.GetToken({ email: user.email, id: user.id })

    return { user, bots, token }
  }

  async function InsertAnotherUserSetup(botsUnRelatedToUserToInsert: number) : Promise<void> {
    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())
    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    for (let i = 1; i <= botsUnRelatedToUserToInsert; i += 1) {
      await dbSetup.botSetup.InsertOne({ userId: user.id })
    }
  }

  async function VerifyResult(bots: Bot[], body: Bot[], includeBotNameOnQuery: boolean) {
    let expectedBots = [...bots]

    if (includeBotNameOnQuery) {
      const [firstBot] = bots
      expectedBots = await dbSetup.botSetup.FindAll({ botName: firstBot.botName })
    }

    assert.deepEqual(body, expectedBots.map((b) => (
      {
        ...b,
        createdAt: body.find((b2) => b2.botName === b.botName).createdAt,
        updatedAt: body.find((b2) => b2.botName === b.botName).updatedAt,
      }
    )))
  }
})
