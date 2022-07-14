import { faker } from '@faker-js/faker'
import CreateUserRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserRequest'
import CityMock from '../../../../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../../../../Shared/Mocks/CountryMock'
import PhoneNumberMock from '../../../../../../../Shared/Mocks/PhoneNumberMock'
import StateMock from '../../../../../../../Shared/Mocks/StateMock'
import UserMock from '../../../../../../../Shared/Mocks/UserMock'

export default class UserControllerStubs {
  public static GetInvalidPayloads() : Array<CreateUserRequest> {
    const stateId = faker.datatype.number(10000)
    const countryId = faker.datatype.number(10000)
    const cityId = faker.datatype.number(10000)

    const state = StateMock.GetDTO({ id: stateId })
    const country = CountryMock.GetDTO({ id: countryId })
    const city = CityMock.GetDTO({ id: cityId })
    const phoneNumber = PhoneNumberMock.GetDTO()

    const user = UserMock.GetRandomPartialUser(countryId, stateId, cityId, faker.datatype.number(10000))
    const userObj = { ...user }
    delete userObj.stateId
    delete userObj.countryId
    delete userObj.cityId
    delete userObj.phoneNumberId

    return [
      {
        state,
        country,
        city,
        phoneNumber: {
          ...phoneNumber,
          whatsappNumber: null,
        },
        ...userObj,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        planId: 0,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        email: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        documentNumber: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        firstName: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        lastName: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        neighbourhood: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        addressStreet: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        addressNumber: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        addressComplement: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        postalCode: null,
      },
      {
        state,
        country,
        city,
        phoneNumber,
        ...userObj,
        password: null,
      },
      {
        state: {
          ...state,
          id: null,
        },
        country,
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state: {
          ...state,
          countryId: null,
        },
        country,
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state: {
          ...state,
          iso2: null,
        },
        country,
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state: {
          ...state,
          name: null,
        },
        country,
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state: {
          ...state,
          stateCode: null,
        },
        country,
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state,
        country: {
          ...country,
          id: null,
        },
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state,
        country: {
          ...country,
          iso2: null,
        },
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state,
        country: {
          ...country,
          name: null,
        },
        city,
        phoneNumber,
        ...userObj,
      },
      {
        state,
        country,
        city: {
          ...city,
          id: null,
        },
        phoneNumber,
        ...userObj,
      },
      {
        state,
        country,
        city: {
          ...city,
          name: null,
        },
        phoneNumber,
        ...userObj,
      },
    ]
  }
}
