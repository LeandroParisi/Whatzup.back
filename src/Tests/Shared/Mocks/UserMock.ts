import { faker } from '@faker-js/faker'
import User from '../../../Server/Domain/Entities/User'

export type UserMockOptionals = Partial<User>

export default class UserMock {
  static GetRandomUser(
    countryId : number, stateId : number, cityId : number, phoneNumberId : number, optionals? : UserMockOptionals,
  ) : User {
    const user = new User()

    user.id = optionals?.id || null
    user.phoneNumberId = phoneNumberId
    user.email = optionals?.email || faker.internet.email()
    user.documentNumber = optionals?.documentNumber || faker.random.numeric(9)
    user.firstName = optionals?.firstName || faker.name.firstName()
    user.lastName = optionals?.lastName || faker.name.lastName()
    user.password = optionals?.password || faker.datatype.string(10)
    user.countryId = countryId || optionals?.countryId
    user.stateId = stateId || optionals?.stateId
    user.cityId = cityId || optionals?.cityId
    user.middleName = optionals?.middleName || faker.name.middleName()
    user.neighbourhood = optionals?.neighbourhood || faker.name.fullName()
    user.addressStreet = optionals?.addressStreet || faker.name.fullName()
    user.addressNumber = optionals?.addressNumber || faker.random.numeric(5)
    user.addressComplement = optionals?.addressComplement || faker.random.numeric(3)
    user.postalCode = optionals?.postalCode || faker.address.zipCode()
    user.isVerified = optionals?.isVerified || faker.datatype.boolean()
    user.isActive = optionals?.isActive || faker.datatype.boolean()
    user.planId = optionals?.planId || null

    return user
  }

  static GetRandomPartialUser(
    countryId : number, stateId : number, cityId : number, phoneNumberId : number, optionals? : UserMockOptionals,
  ) : Partial<User> {
    const user = this.GetRandomUser(countryId, stateId, cityId, phoneNumberId, optionals)

    return user as Partial<User>
  }
}
