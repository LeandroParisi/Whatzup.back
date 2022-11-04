/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable no-use-before-define */
import { assert } from 'chai'
import express from 'express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import request from 'supertest'
import UpdateUserRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/UpdateUserRequest'
import { BaseRoutes } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import EntityCleaning from '../../../../../../../../Server/Application/Shared/Serializers/EntityCleaning'
import User from '../../../../../../../../Server/Domain/Entities/User'
import { Server } from '../../../../../../../../Server/Server'
import JwtMocks from '../../../../../../../Shared/Mocks/JwtMocks'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'
import UserControllerStubs, { CreateUpdatePossibleValidScenarios } from './UserControllerStubs'

describe('User controller update: Integrated Tests', () => {
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

  const validScenarioTheories = [
    CreateUpdatePossibleValidScenarios.WithNewPhoneNumber,
    CreateUpdatePossibleValidScenarios.WithNewPlan,
  ]

  theoretically(
    '1. Should properlly update user and related dependencies',
    validScenarioTheories,
    async (theory) => {
    // Arrange
      const {
        user, country, state, city,
      } = await dbSetup.BasicUserBotSetupWithPlan()
      const { plan } = await dbSetup.DefaultPlanSetup()
      const token = JwtMocks.GetToken({ email: user.email, id: user.id })

      const payload = UserControllerStubs.GetValidUpdatePayload(theory, plan.id, { country, state, city })

      // Act
      const response = await request(app)
        .put(`/api/${BaseRoutes.AccountManagementUser}`)
        .set('authorization', token)
        .send(payload)

      // Assert
      expect(response.status).toBe(StatusCode.OK)
      await AssertValidScenario(user, payload, theory)
    },
  )

  // theoretically(
  //   '2. Should not accept request with invalid data',
  //   UserControllerStubs.GetInvalidUpdatePayloads(),
  //   async (theory) => {
  //     // Act
  //     const response = await request(app).post(`/api/${BaseRoutes.AccountManagementUser}`).send(theory)

  //     // Assert
  //     assert.equal(response.status, StatusCode.BAD_REQUEST)
  //   },
  // )

  async function AssertValidScenario(user: User, payload: UpdateUserRequest, theory: CreateUpdatePossibleValidScenarios) {
    const updatedUser = await dbSetup.userSetup.FindOne({ id: user.id }) as Partial<User>

    const cleanedPayload = EntityCleaning.CleanSpecificFields(
      payload,
      new Set([
        'country',
        'state',
        'city',
        'phoneNumber',
        'id',
        'planId',
      ]),
    )

    const expectedUser = { ...user, ...cleanedPayload, updatedAt: updatedUser.updatedAt }

    delete updatedUser.GetFullName

    switch (theory) {
      case CreateUpdatePossibleValidScenarios.WithNewPhoneNumber:
        delete expectedUser.phoneNumber
        const newPhone = await dbSetup.phoneNumberSetup.FindOne({ whatsappNumber: payload.phoneNumber.whatsappNumber })
        expect(newPhone).not.toBeNull()
        assert.deepNestedInclude(newPhone, payload.phoneNumber)
        expectedUser.phoneNumberId = newPhone.id
        break
      case CreateUpdatePossibleValidScenarios.WithNewPlan:
        break
      default:
        throw new Error(`Integrated tests: Invalid update valid scenario ${theory}`)
    }

    assert.deepEqual(updatedUser, expectedUser)
  }
})
