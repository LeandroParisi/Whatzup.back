import { faker } from '@faker-js/faker'
import City from '../../../Server/Domain/Entities/City'

type MockOptionals = Partial<City>

export default class CityMock {
  static GetRandom(_optionals? : MockOptionals) : Partial<City> {
    const city : Partial<City> = {
      name: faker.name.findName(),
    }

    return city
  }
}
