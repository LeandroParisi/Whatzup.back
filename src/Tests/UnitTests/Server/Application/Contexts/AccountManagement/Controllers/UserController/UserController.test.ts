/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import chai, { assert } from 'chai'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import {
  anything, instance, mock, verify, when,
} from 'ts-mockito'
import UserController from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/UserController'
import { IBaseRepository } from '../../../../../../../../Server/Application/Shared/Repositories/IRepository'
import { CityRepository } from '../../../../../../../../Server/Infrastructure/PgTyped/Repositories/CityRepository'
import { CountryRepository } from '../../../../../../../../Server/Infrastructure/PgTyped/Repositories/CountryRepository'
import { StateRepository } from '../../../../../../../../Server/Infrastructure/PgTyped/Repositories/StateRepository'
import { UserRepository } from '../../../../../../../../Server/Infrastructure/PgTyped/Repositories/UserRepository'
import CityMock from '../../../../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../../../../Shared/Mocks/CountryMock'
import StateMock from '../../../../../../../Shared/Mocks/StateMock'
import UserControllerStubs from './UserControllerStubs'

chai.should()

describe('User Controller: Unit Tests', () => {
  let userRepository : UserRepository
  let countryRepository : CountryRepository
  let stateRepository : StateRepository
  let cityRepository : CityRepository
  let userController : UserController

  beforeEach(() => {
    TestSetup()
  })

  theoretically(
    'Should create user and related locations if necessary',
    UserControllerStubs.GetSucessTheory(),
    async (theory) => {
      // Arrange
      const { cityExists, countryExists, stateExists } = theory
      const payload = UserControllerStubs.GetCorrectRequestPayload()
      SetUpLocationRepositoryMock(cityExists, cityRepository, CityMock.GetRandom())
      SetUpLocationRepositoryMock(countryExists, countryRepository, CountryMock.GetRandom())
      SetUpLocationRepositoryMock(stateExists, stateRepository, StateMock.GetRandom())

      when(userRepository.Create(payload, anything())).thenResolve(anything())

      // Act
      let error : Error = null
      try {
        await userController.Create(payload)
      } catch (e) {
        error = e as Error
      }

      // Assert
      CheckResult(cityExists, countryExists, stateExists, true, error)
    },
  )

  it('Should throw an error if theres an error on database during localities check', async () => {
    // Arrange
    const payload = UserControllerStubs.GetCorrectRequestPayload()
    when(countryRepository.FindOne(anything(), anything())).thenReject()

    // Act
    let error : Error = null
    try {
      await userController.Create(payload)
    } catch (e) {
      error = e as Error
    }

    // Assert
    assert.isNotNull(error)
    verify(userRepository.Create(anything(), anything())).never()
  })

  function SetUpLocationRepositoryMock<Model>(exists: boolean, repository: IBaseRepository<Model>, response : Model) {
    if (exists) {
      when(repository.FindOne(anything(), anything())).thenResolve(response)
    } else {
      when(repository.FindOne(anything(), anything())).thenResolve(null)
    }
  }

  function CheckResult(cityExists: boolean, countryExists: boolean, stateExists: boolean, success: boolean, error? : Error) {
    if (cityExists) {
      verify(cityRepository.Create(anything(), anything())).never()
    } else {
      verify(cityRepository.Create(anything(), anything())).once()
    }
    if (countryExists) {
      verify(countryRepository.Create(anything(), anything())).never()
    } else {
      verify(countryRepository.Create(anything(), anything())).once()
    }
    if (stateExists) {
      verify(stateRepository.Create(anything(), anything())).never()
    } else {
      verify(stateRepository.Create(anything(), anything())).once()
    }

    if (success) {
      assert.isNull(error)
    } else {
      assert.isNotNull(error)
    }
  }

  function TestSetup() {
    userRepository = mock(UserRepository)
    countryRepository = mock(CountryRepository)
    stateRepository = mock(StateRepository)
    cityRepository = mock(CityRepository)
    userController = new UserController(
      instance(userRepository), instance(countryRepository), instance(stateRepository), instance(cityRepository),
    )
  }
})
