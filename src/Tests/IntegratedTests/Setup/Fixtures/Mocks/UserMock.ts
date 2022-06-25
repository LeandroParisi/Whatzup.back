import { faker } from '@faker-js/faker'
import User from '../../../../../Server/Domain/Entities/User'

export type UserMockOptionals = Partial<User>

export default class UserMock {
  static GetRandomUser(countryId : number, stateId : number, cityId : number, optionals? : UserMockOptionals) : User {
    const phone = faker.phone.number()
    return new User(
      Number(faker.random.numeric(Number.MAX_SAFE_INTEGER, { allowLeadingZeros: true })),
      phone,
      `55@${phone}`,
      faker.internet.email(),
      faker.random.numeric(9),
      faker.name.firstName(),
      faker.name.middleName(),
      faker.name.lastName(),
      countryId,
      stateId,
      cityId,
      faker.address.streetName(),
      faker.address.streetName(),
      faker.random.numeric(5),
      faker.random.numeric(3),
      faker.address.zipCode(),
      optionals?.wasActivated || faker.datatype.boolean(),
      optionals?.isActivated || faker.datatype.boolean(),
      faker.date.recent(),
      faker.date.recent(),
    )
  }
}
