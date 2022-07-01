import { faker } from '@faker-js/faker'
import User from '../../../Server/Domain/Entities/User'

export type UserMockOptionals = Partial<User>

export default class UserMock {
  static GetRandomUser(
    countryId : number, stateId : number, cityId : number, optionals? : UserMockOptionals,
  ) : User {
    const phone = faker.phone.number()

    const user = new User(
      null || optionals?.id,
      optionals?.whatsappNumber || phone,
      optionals?.whatsappId || `55@${phone}`,
      optionals?.email || faker.internet.email(),
      optionals?.documentNumber || faker.random.numeric(9),
      optionals?.firstName || faker.name.firstName(),
      optionals?.lastName || faker.name.lastName(),
      optionals?.password || faker.datatype.string(10),
      countryId || optionals?.countryId,
      stateId || optionals?.stateId,
      cityId || optionals?.cityId,
      optionals?.middleName || faker.name.middleName(),
      optionals?.neighbourhood || faker.name.findName(),
      optionals?.addressStreet || faker.name.findName(),
      optionals?.addressNumber || faker.random.numeric(5),
      optionals?.addressComplement || faker.random.numeric(3),
      optionals?.postalCode || faker.address.zipCode(),
      optionals?.wasActivated || optionals?.wasActivated || faker.datatype.boolean(),
      optionals?.isActive || optionals?.isActive || faker.datatype.boolean(),
      optionals?.planId || null,
    )

    return user
  }

  static GetRandomPartialUser(
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
      password: faker.datatype.string(10),
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
