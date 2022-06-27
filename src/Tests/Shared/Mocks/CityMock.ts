import { faker } from '@faker-js/faker'
import { CityDTO } from '../../../Server/Application/Shared/DTOs/Locations/CityDTO'
import City from '../../../Server/Domain/Entities/City'

type MockOptionals = Partial<City>

export default class CityMock {
  static GetRandom(optionals? : MockOptionals) : Partial<City> {
    let city : Partial<City> = {
      name: faker.name.findName(),
    }

    if (optionals) {
      city = {
        ...city,
        ...optionals,
      }
    }

    return city
  }

  static GetDTO(optionals? : MockOptionals) : CityDTO {
    let city : CityDTO = {
      name: faker.name.findName(),
      id: faker.datatype.number(1000),
    }

    if (optionals) {
      city = {
        ...city,
        ...optionals,
      }
    }

    return city
  }
}
