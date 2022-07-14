import { faker } from '@faker-js/faker'
import CreateUserRequest from '../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserRequest'
import PhoneNumberMock from '../Mocks/PhoneNumberMock'
import UserMock from '../Mocks/UserMock'

export default class UserControllerStubsShared {
  static GetCorrectRequestPayload() : CreateUserRequest {
    const cityId = faker.datatype.number()
    const stateId = faker.datatype.number()
    const countryId = faker.datatype.number()
    const phoneNumberId = faker.datatype.number()

    const user = UserMock.GetRandomPartialUser(countryId, stateId, cityId, phoneNumberId)

    const userPayload = { ...user }
    delete userPayload.cityId
    delete userPayload.countryId
    delete userPayload.stateId
    delete userPayload.phoneNumberId
    delete userPayload.isActive
    delete userPayload.wasActivated

    const payload : CreateUserRequest = {
      city: {
        id: cityId,
        name: faker.name.findName(),
      },
      country: {
        id: countryId,
        iso2: faker.datatype.string(2),
        name: faker.name.findName(),
      },
      state: {
        id: stateId,
        name: faker.name.findName(),
        countryId,
        iso2: faker.datatype.string(2),
        stateCode: faker.datatype.string(2),
      },
      phoneNumber: {
        ...PhoneNumberMock.GetDTO(),
      },
      ...userPayload,
    }

    return payload
  }
}
