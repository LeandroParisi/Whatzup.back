import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import { Server } from '../../../../../../../../Server/Server'
import UserControllerStubsShared from '../../../../../../../Shared/Stubs/UserControllerStubs.shared'
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

  it('1. Should properlly create user and related localities', async () => {
    // Arrange
    const payload = UserControllerStubsShared.GetCorrectRequestPayload()
    const expectedUser = { ...payload }
    delete expectedUser.city
    delete expectedUser.country
    delete expectedUser.state

    // Act
    const response = await request(app).post('/api/account-management/user').send(payload)

    // Assert
    const insertedUser = await dbSetup.userSetup.FindOne({ email: payload.email })
    const insertedState = await dbSetup.stateSetup.FindOne({ iso2: payload.state.iso2 })
    const insertedCity = await dbSetup.citySetup.FindOne({ name: payload.city.name })
    const insertedCountry = await dbSetup.countrySetup.FindOne({ iso2: payload.country.iso2 })

    assert.equal(response.status, StatusCode.CREATED)
    assert.deepEqual(JSON.stringify({ ...insertedUser, ...expectedUser }), JSON.stringify(insertedUser))
    assert.deepEqual(insertedState, payload.state)
    assert.deepEqual(insertedCity, payload.city)
    assert.deepEqual(insertedCountry, payload.country)
  })

  theoretically(
    '2. Should not accept request with invalid data',
    UserControllerStubs.GetInvalidPayloads(),
    async (theory) => {
      // Act
      const response = await request(app).post('/api/account-management/user').send(theory)

      // Assert
      assert.equal(response.status, StatusCode.BAD_REQUEST)
    },
  )
})
