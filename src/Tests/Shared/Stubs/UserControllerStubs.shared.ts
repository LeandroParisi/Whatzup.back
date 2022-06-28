import { faker } from '@faker-js/faker'
import CreateUserRequest from '../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserRequest'
import UserMock from '../Mocks/UserMock'

export default class UserControllerStubsShared {
  static GetCorrectRequestPayload() : CreateUserRequest {
    const cityId = faker.datatype.number()
    const stateId = faker.datatype.number()
    const countryId = faker.datatype.number()

    const user = UserMock.GetRandomPartialUser(countryId, stateId, cityId)

    const userPayload = { ...user }
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
      ...userPayload,
    }

    return payload
  }
}
