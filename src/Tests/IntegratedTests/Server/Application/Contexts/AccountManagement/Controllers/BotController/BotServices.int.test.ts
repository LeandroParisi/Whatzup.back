/* eslint-disable no-await-in-loop */
import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import Container from 'typedi'
import { BotServices } from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/BotServices'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import BotMock from '../../../../../../../Shared/Mocks/BotMock'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'

describe('Bot services integrated tests', () => {
  let dbSetup : DbSetup
  const botServices = Container.get(BotServices)

  beforeEach(() => {
    dbSetup = new DbSetup()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
  })

  const withoutSameNameTheories = [
    { numberOfBots: 1 },
    { numberOfBots: 3 },
    { numberOfBots: 5 },
    { numberOfBots: 7 },
  ]

  const withSameNameTheories = [
    { numberOfBots: 1, withSameName: 0 },
    { numberOfBots: 3, withSameName: 2 },
    { numberOfBots: 5, withSameName: 3 },
    { numberOfBots: 7, withSameName: 4 },
  ]

  theoretically(
    '1. Should properlly return entities when valid query is passed',
    withoutSameNameTheories,
    async ({ numberOfBots }) => {
    // Arrange
      const { user } = await dbSetup.BasicUserSetup()
      const insertedBots : Array<Bot> = []

      for (let i = 1; i <= numberOfBots; i += 1) {
        const insertedBot = await dbSetup.botSetup.InsertOne(BotMock.GetRandom({ userId: user.id }))
        insertedBots.push(insertedBot)
      }

      const { botName } = insertedBots.sort(() => Math.random() - 0.5)[0]

      const query : Partial<Bot> = { userId: user.id, botName }

      // Act
      const foundBots = await botServices.FindAll(query)

      const expectedBot = await dbSetup.botSetup.FindOne({ botName })

      // Assert
      expect(foundBots.length).toBe(1)
      assert.deepEqual(expectedBot, foundBots[0])
    },
  )

  theoretically(
    '2. Should return all bots that share same name',
    withSameNameTheories,
    async ({ numberOfBots, withSameName }) => {
    // Arrange
      const { user } = await dbSetup.BasicUserSetup()
      const insertedBots : Array<Bot> = []

      let sameName = ''
      let botsWithSameNameInserted = 0

      for (let i = 1; i <= numberOfBots; i += 1) {
        let newBot

        if (sameName.length && botsWithSameNameInserted < withSameName) {
          newBot = BotMock.GetRandom(
            { userId: user.id, botName: `${faker.name.findName()} ${sameName} ${faker.name.findName()}` },
          )
          botsWithSameNameInserted += 1
        } else {
          newBot = BotMock.GetRandom({ userId: user.id })
        }

        const insertedBot = await dbSetup.botSetup.InsertOne(newBot)

        if (i === 1) sameName = insertedBot.botName

        insertedBots.push(insertedBot)
      }

      // const { botName } = insertedBots.sort(() => Math.random() - 0.5)[0]

      const query : Partial<Bot> = { userId: user.id, botName: sameName }

      // Act
      const foundBots = await botServices.FindAll(query)

      // Assert
      expect(foundBots.length).toBe(1 + withSameName)
    },
  )
})
