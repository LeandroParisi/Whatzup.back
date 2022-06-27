import { faker } from '@faker-js/faker'
import { StateDTO } from '../../../Server/Application/Shared/DTOs/Locations/StateDTO'
import State from '../../../Server/Domain/Entities/State'

type MockOptionals = Partial<State>

export default class StateMock {
  static GetRandom(optionals? : MockOptionals) : Partial<State> {
    let state : Partial<State> = {
      name: faker.name.findName(),
      countryId: optionals?.countryId || faker.datatype.number(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
      stateCode: faker.datatype.string(2),
    }

    if (optionals) {
      state = {
        ...state,
        ...optionals,
      }
    }

    return state
  }

  static GetDTO(optionals? : MockOptionals) : StateDTO {
    let state : StateDTO = {
      name: faker.name.findName(),
      countryId: optionals?.countryId || faker.datatype.number(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
      stateCode: faker.datatype.string(2),
      id: faker.datatype.number(1000),
    }

    if (optionals) {
      state = {
        ...state,
        ...optionals,
      }
    }

    return state
  }
}
