/* eslint-disable no-use-before-define */
import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import UpdateBotRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/Requests/UpdateBot/UpdateBotRequestBody'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import PhoneNumber from '../../../../../../../../Server/Domain/Entities/PhoneNumber'
import User from '../../../../../../../../Server/Domain/Entities/User'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
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

  theoretically(
    ({
      botName, phoneNumbers, steps,
    }) => `1. Should properlly update bot with \n${botName}\n${phoneNumbers?.join(', ')}\n${steps?.join(', ')}`,
    BotControllerStubs.GetValidUpdateTheory(),
    async (theory) => {
    // Arrange
      const { bot, token } = await Setup()

      // Act
      const response = await request(app)
        .put(`/api/${BaseRoutes.AccountManagementBot}/${bot.id}`)
        .set('authorization', token)
        .send(theory)

      // Assert
      const updatedBot = await dbSetup.botSetup.FindOne({ id: bot.id })
      const botPhoneNumbers = await dbSetup.phoneNumberSetup.FindAllByBotId(bot.id)

      expect(response.status).toBe(StatusCode.OK)
      expect(updatedBot).not.toBeNull()
      AssertValidInfo(theory, updatedBot, botPhoneNumbers)
    },
  )

  // it('2. Should not update bot if user does not exist', async () => {
  //   // Arrange
  //   const { bot, user } = await Setup()

  //   const token = JwtMocks.GetToken({ email: faker.internet.email(), id: user.id + faker.datatype.number() })

  //   const body : UpdateBotRequest = {
  //     botName: `NOVO_NOME: ${faker.name.findName()}`,
  //     steps: StepMock.GenerateXSteps(FeatureSetup.MAX_STEPS_FEATURE.limit - 1),
  //   }

  //   // Act
  //   const response = await request(app)
  //     .put(`/api/${BaseRoutes.AccountManagementBot}/${bot.id}`)
  //     .set('authorization', token)
  //     .send(body)

  //   // Assert
  //   expect(response.status).toBe(StatusCode.NOT_FOUND)
  // })

  // it('3. Should not update bot it does not belongs to user', async () => {
  //   // Arrange
  //   const { bot } = await Setup()

  //   const { token: anotherUserToken } = await Setup()

  //   const body : UpdateBotRequest = {
  //     botName: `NOVO_NOME: ${faker.name.findName()}`,
  //     steps: StepMock.GenerateXSteps(FeatureSetup.MAX_STEPS_FEATURE.limit - 1),
  //   }

  //   // Act
  //   const response = await request(app)
  //     .put(`/api/${BaseRoutes.AccountManagementBot}/${bot.id}`)
  //     .set('authorization', anotherUserToken)
  //     .send(body)

  //   // Assert
  //   expect(response.status).toBe(StatusCode.NOT_FOUND)
  // })

  // theoretically(
  //   '4. Should not accept request with invalid data',
  //   BotControllerStubs.GetInvalidUpdatePayload(),
  //   async (body) => {
  //   // Arrange
  //     const { bot, token } = await Setup()

  //     // Act
  //     const response = await request(app)
  //       .put(`/api/${BaseRoutes.AccountManagementBot}/${bot.id}`)
  //       .set('authorization', token)
  //       .send(body)

  //     // Assert
  //     expect(response.status).toBe(StatusCode.BAD_REQUEST)
  //   },
  // )

  async function Setup() : Promise<{user : User, bot : Bot, token : string}> {
    const { plan } = await dbSetup.DefaultPlanSetup()
    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })
    const bot = await dbSetup.botSetup.InsertOne({ userId: user.id })
    const token = JwtMocks.GetToken({ email: user.email, id: user.id })

    return { user, bot, token }
  }
})

function AssertValidInfo(
  { botName, phoneNumbers, steps }: Partial<UpdateBotRequest>, updatedBot: Bot, botPhoneNumbers: PhoneNumber[],
) {
  if (botName) {
    expect(botName).toBe(updatedBot.botName)
  }
  if (phoneNumbers?.length) {
    assert.deepEqual(phoneNumbers, botPhoneNumbers)
  }
  if (steps?.length) {
    assert.deepEqual(steps, updatedBot.steps)
  }
}
