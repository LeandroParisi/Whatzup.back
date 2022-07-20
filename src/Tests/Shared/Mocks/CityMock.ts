import { faker } from '@faker-js/faker'
import City from '../../../Server/Domain/Entities/City'

type MockOptionals = Partial<City>

export default class CityMock {
  static GetRandom(stateId : number, optionals? : MockOptionals) : City {
    const city : City = {
      id: optionals?.id || null,
      name: optionals?.name || faker.name.findName(),
      stateId,
    }

    return city
  }

  // static GetDTO(optionals? : MockOptionals) : CityDTO {
  //   let city : CityDTO = {
  //     name: faker.name.findName(),
  //     id: faker.datatype.number(1000),
  //   }

  //   if (optionals) {
  //     city = {
  //       ...city,
  //       ...optionals,
  //     }
  //   }

  //   return city
  // }
}
