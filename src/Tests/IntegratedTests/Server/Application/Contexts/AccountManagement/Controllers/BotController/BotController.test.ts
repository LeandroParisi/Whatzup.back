import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import { Server } from '../../../../../../../../Server/Server'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'
import BotControllerStubs from './BotControllerStubs'

describe('Bot controller: Integrated Tests', () => {
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
    const { user } = await dbSetup.BasicUserSetup()
    const payload = BotControllerStubs.GetValidPayload(user.id)

    // Act
    const response = await request(app).post('/api/account-management/bot').send(payload)

    // Assert
    assert.equal(response.status, StatusCode.CREATED)
  })

  it('2. Should not create bot if user does not exist', async () => {
    // Arrange
    const payload = BotControllerStubs.GetValidPayload()

    // Act
    const response = await request(app).post('/api/account-management/bot').send(payload)

    // Assert
    assert.equal(response.status, StatusCode.BAD_REQUEST)
  })

  theoretically(
    '3. Should not accept request with invalid data',
    BotControllerStubs.GetInvalidPayloadTheory(),
    async (theory) => {
      // Arrange
      const { userId } = theory
      await dbSetup.BasicUserSetup({ user: { id: userId } })
      // Act
      const response = await request(app).post('/api/account-management/bot').send(theory)

      // Assert
      assert.equal(response.status, StatusCode.BAD_REQUEST)
    },
  )
})
