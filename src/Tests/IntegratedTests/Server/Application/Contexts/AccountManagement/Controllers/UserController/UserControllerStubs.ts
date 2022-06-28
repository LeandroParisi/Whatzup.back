import { faker } from '@faker-js/faker'
import CreateUserRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserRequest'
import CityMock from '../../../../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../../../../Shared/Mocks/CountryMock'
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

    const user = UserMock.GetRandomPartialUser(countryId, stateId, cityId)
    const userObj = { ...user }
    delete userObj.stateId
    delete userObj.countryId
    delete userObj.cityId

    return [
      {
        state,
        country,
        city,
        ...userObj,
        whatsappNumber: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        whatsappId: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        email: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        documentNumber: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        firstName: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        lastName: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        neighbourhood: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        addressStreet: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        addressNumber: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        addressComplement: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        postalCode: null,
      },
      {
        state,
        country,
        city,
        ...userObj,
        password: null,
      },
    ]
  }
}
