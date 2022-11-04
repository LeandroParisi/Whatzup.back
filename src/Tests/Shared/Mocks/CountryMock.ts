import { faker } from '@faker-js/faker'
import Country from '../../../Server/Domain/Entities/Country'

type MockOptionals = Partial<Country>

export default class CountryMock {
  static GetRandom(optionals? : MockOptionals) : Country {
    const country : Country = {
      id: optionals?.id || null,
      name: optionals?.name || faker.name.fullName(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
      currency: optionals?.currency || faker.datatype.string(2),
      emoji: optionals?.emoji || faker.datatype.string(2),
      iso3: optionals?.iso3 || faker.datatype.string(2),
      phoneCode: optionals?.phoneCode || faker.datatype.string(2),
    }

    return country
  }

  // static GetDTO(optionals? : MockOptionals) : CountryDTO {
  //   let country : CountryDTO = {
  //     name: faker.name.fullName(),
  //     iso2: optionals?.iso2 || faker.datatype.string(2),
  //     id: faker.datatype.number(1000),
  //   }

  //   if (optionals) {
  //     country = {
  //       ...country,
  //       ...optionals,
  //     }
  //   }

  //   return country
  // }
}
