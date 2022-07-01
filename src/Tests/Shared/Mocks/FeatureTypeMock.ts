import { faker } from '@faker-js/faker'
import FeatureType from '../../../Server/Domain/Entities/FeatureType'

type MockOptionals = Partial<FeatureType>

export default class FeatureTypeMock {
  static GetRandom(optionals? : MockOptionals) : FeatureType {
    const entity : FeatureType = {
      id: optionals?.id || faker.datatype.number(),
      name: optionals?.name || faker.name.findName(),
    }

    return entity
  }
}
