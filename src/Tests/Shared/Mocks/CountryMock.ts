import { faker } from '@faker-js/faker'
import { CountryDTO } from '../../../Server/Application/Shared/DTOs/Locations/CountryDTO'
import Country from '../../../Server/Domain/Entities/Country'

type MockOptionals = Partial<Country>

export default class CountryMock {
  static GetRandom(optionals? : MockOptionals) : Partial<Country> {
    let country : Partial<Country> = {
      name: faker.name.findName(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
    }

    if (optionals) {
      country = {
        ...country,
        ...optionals,
      }
    }

    return country
  }

  static GetDTO(optionals? : MockOptionals) : CountryDTO {
    let country : CountryDTO = {
      name: faker.name.findName(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
      id: faker.datatype.number(1000),
    }

    if (optionals) {
      country = {
        ...country,
        ...optionals,
      }
    }

    return country
  }
}
