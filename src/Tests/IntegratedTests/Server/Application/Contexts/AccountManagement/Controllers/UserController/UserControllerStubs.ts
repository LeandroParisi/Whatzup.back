/* eslint-disable no-shadow */
import { faker } from '@faker-js/faker'
import CreateUserRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserRequest'
import UpdateUserRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/UpdateUserRequest'
import { Locations } from '../../../../../../../../Server/Domain/Aggregations/Locations'
import PhoneNumberMock from '../../../../../../../Shared/Mocks/PhoneNumberMock'
import UserMock from '../../../../../../../Shared/Mocks/UserMock'

export enum CreateUpdatePossibleValidScenarios {
  WithNewCountry,
  WithNewState,
  WithNewCity,
  WithNewPhoneNumber,
  WithNewPlan
}

export default class UserControllerStubs {
  public static GetInvalidCreatePayloads() : Array<CreateUserRequest> {
    const stateId = faker.datatype.number(10000)
    const countryId = faker.datatype.number(10000)
    const cityId = faker.datatype.number(10000)
    
    const phoneNumberId = faker.datatype.number(10000)

    const phoneNumber = PhoneNumberMock.GetDTO()

    const user = UserMock.GetRandomUser(countryId, stateId, cityId, phoneNumberId)

    delete user.phoneNumberId
    delete user.id

    return [
      {
        ...user,
        phoneNumber: {
          whatsappNumber: null
        }
      },
      {
        ...user,
        phoneNumber,
        planId: 0
      },
      {
        ...user,
        phoneNumber,
        email: null
      },
      {
        ...user,
        phoneNumber,
        password: null
      },
      {
        ...user,
        phoneNumber,
        documentNumber: null
      },
      {
        ...user,
        phoneNumber,
        firstName: null
      },
      {
        ...user,
        phoneNumber,
        lastName: null
      },
      {
        ...user,
        phoneNumber,
        stateId: null
      },
      {
        ...user,
        phoneNumber,
        cityId: null
      },
      {
        ...user,
        phoneNumber,
        countryId: null
      }
    ]
  }

  static GetCorrectRequestPayload(
    {country: {id: countryId}, state: {id: stateId}, city: {id: cityId}} : Locations
    ) : CreateUserRequest {
    const phoneNumberId = faker.datatype.number()

    const user = UserMock.GetRandomUser(countryId, stateId, cityId, phoneNumberId)

    const userPayload = { ...user }
    
    delete userPayload.id
    delete userPayload.phoneNumberId
    delete userPayload.isActive
    delete userPayload.wasActivated

    const payload : CreateUserRequest = {
      phoneNumber: {
        ...PhoneNumberMock.GetDTO(),
      },
      ...userPayload,
    }

    return payload
  }

  public static GetValidUpdatePayload(
    theory : CreateUpdatePossibleValidScenarios,
    newPlanId : number,
    { country, state, city } : Locations,
  ) : UpdateUserRequest {
    const {
      addressStreet,
      documentNumber,
      email,
      firstName,
      lastName,
      middleName,
      neighbourhood,
      addressComplement,
      addressNumber,
      postalCode,
    } = UserMock.GetRandomPartialUser(1, 1, 1, 1)

    const payloadToSend : UpdateUserRequest = {
      addressComplement,
      addressNumber,
      addressStreet,
      documentNumber,
      email,
      firstName,
      lastName,
      middleName,
      neighbourhood,
      planId: theory === CreateUpdatePossibleValidScenarios.WithNewPlan ? newPlanId : null,
      postalCode,
      countryId: country.id,
      stateId: state.id,
      cityId: city.id,
      phoneNumber: theory === CreateUpdatePossibleValidScenarios.WithNewPhoneNumber ? PhoneNumberMock.GetDTO() : null,
    }

    return payloadToSend
  }
  
  static GetInvalidUpdatePayloads(
    {country: {id: countryId}, state: {id: stateId}, city: {id: cityId}} : Locations
    ) : CreateUserRequest {
    const phoneNumberId = faker.datatype.number()

    const user = UserMock.GetRandomUser(countryId, stateId, cityId, phoneNumberId)

    const userPayload = { ...user }
    
    delete userPayload.id
    delete userPayload.phoneNumberId
    delete userPayload.isActive
    delete userPayload.wasActivated

    const payload : CreateUserRequest = {
      phoneNumber: {
        ...PhoneNumberMock.GetDTO(),
      },
      ...userPayload,
    }

    return payload
  }
}
