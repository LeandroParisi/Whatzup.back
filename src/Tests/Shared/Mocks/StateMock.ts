import { faker } from '@faker-js/faker'
import State from '../../../Server/Domain/Entities/State'

type MockOptionals = Partial<State>

export default class StateMock {
  static GetRandom(optionals? : MockOptionals) : Partial<State> {
    const state : Partial<State> = {
      name: faker.name.findName(),
      countryId: optionals?.countryId || faker.datatype.number(),
      iso2: optionals?.iso2 || faker.datatype.string(2),
      stateCode: faker.datatype.string(2),
    }

    return state
  }
}
