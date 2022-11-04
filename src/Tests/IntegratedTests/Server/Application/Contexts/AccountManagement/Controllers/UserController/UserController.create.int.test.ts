import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import { Server } from '../../../../../../../../Server/Server'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'
import UserControllerStubs from './UserControllerStubs'

describe('User controller: Integrated Tests', () => {
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

  it('1. Should properlly create user and related localities', async () => {
    // Arrange
    const { country, state, city } = await dbSetup.BasicLocationsSetup()
    const payload = UserControllerStubs.GetCorrectRequestPayload({ country, state, city })

    const expectedUser = { ...payload }
    delete expectedUser.phoneNumber

    // Act
    const response = await request(app).post(`/api/${BaseRoutes.AccountManagementUser}`).send(payload)

    // Assert
    const insertedUser = await dbSetup.userSetup.FindOne({ email: payload.email })

    assert.equal(response.status, StatusCode.CREATED)
    assert.deepEqual(
      { ...insertedUser, password: expectedUser.password },
      {
        ...expectedUser,
        id: insertedUser.id,
        phoneNumberId: insertedUser.phoneNumberId,
        createdAt: insertedUser.createdAt,
        updatedAt: insertedUser.updatedAt,
        isActive: true,
        isVerified: false,
      },
    )
  })

  theoretically(
    '2. Should not accept request with invalid data',
    UserControllerStubs.GetInvalidCreatePayloads(),
    async (theory) => {
      await dbSetup.BasicLocationsSetup({ city: { id: theory.cityId }, state: { id: theory.stateId }, country: { id: theory.countryId } })

      // Act
      const response = await request(app).post(`/api/${BaseRoutes.AccountManagementUser}`).send(theory)

      // Assert
      assert.equal(response.status, StatusCode.BAD_REQUEST)
    },
  )
})
