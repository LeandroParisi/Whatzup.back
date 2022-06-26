import { faker } from '@faker-js/faker'
import Country from '../../../Server/Domain/Entities/Country'

type MockOptionals = Partial<Country>

export default class CountryMock {
  static GetRandom(optionals? : MockOptionals) : Partial<Country> {
    const country : Partial<Country> = {
      name: faker.name.findName(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
    }

    return country
  }
}
