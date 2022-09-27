import { faker } from '@faker-js/faker'
import State from '../../../Server/Domain/Entities/State'

type MockOptionals = Partial<State>

export default class StateMock {
  static GetRandom(countryId : number, optionals? : MockOptionals) : State {
    const state : State = {
      id: optionals?.id || null,
      name: optionals?.name || faker.name.fullName(),
      countryId,
      stateCode: optionals?.stateCode || faker.datatype.string(2),
    }

    return state
  }

  // static GetDTO(optionals? : MockOptionals) : StateDTO {
  //   let state : StateDTO = {
  //     name: faker.name.fullName(),
  //     countryId: optionals?.countryId || faker.datatype.number(),
  //     iso2: optionals?.iso2 || faker.datatype.string(2),
  //     stateCode: faker.datatype.string(2),
  //     id: faker.datatype.number(1000),
  //   }

  //   if (optionals) {
  //     state = {
  //       ...state,
  //       ...optionals,
  //     }
  //   }

  //   return state
  // }
}
