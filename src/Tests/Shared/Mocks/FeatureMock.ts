import { faker } from '@faker-js/faker'
import DateUtils from '../../../Server/Commons/Utils/DateUtils'
import Feature from '../../../Server/Domain/Entities/Feature'

type MockOptionals = Partial<Feature>

export default class FeatureMock {
  static GetRandom(typeId : number, optionals? : MockOptionals) : Feature {
    const entity : Feature = {
      id: optionals?.id || faker.datatype.number(),
      name: optionals?.name || faker.name.findName(),
      typeId,
      createdAt: DateUtils.DateNow(),
      updatedAt: DateUtils.DateNow(),
      isActive: faker.datatype.boolean(),
    }

    return entity
  }
}
