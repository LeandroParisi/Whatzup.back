import { faker } from '@faker-js/faker'
import User from '../../../Server/Domain/Entities/User'

export type UserMockOptionals = Partial<User>

export default class UserMock {
  static GetRandomUser(
    countryId : number, stateId : number, cityId : number, optionals? : UserMockOptionals,
  ) : Partial<User> {
    const phone = faker.phone.number()

    let user : Partial<User> = {
      whatsappNumber: phone,
      whatsappId: `55@${phone}`,
      email: faker.internet.email(),
      documentNumber: faker.random.numeric(9),
      firstName: faker.name.firstName(),
      middleName: faker.name.middleName(),
      lastName: faker.name.lastName(),
      countryId,
      stateId,
      cityId,
      neighbourhood: faker.name.findName(),
      addressStreet: faker.name.findName(),
      addressNumber: faker.random.numeric(5),
      addressComplement: faker.random.numeric(3),
      postalCode: faker.address.zipCode(),
      wasActivated: optionals?.wasActivated || faker.datatype.boolean(),
      isActive: optionals?.isActive || faker.datatype.boolean(),
    }

    if (optionals) {
      user = {
        ...user,
        ...optionals,
      }
    }

    return user
  }
}
