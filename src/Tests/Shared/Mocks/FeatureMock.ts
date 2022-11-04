import { faker } from '@faker-js/faker'
import DateUtils from '../../../Commons/Utils/DateUtils'
import Feature from '../../../Server/Domain/Entities/Feature'
import { FeatureNames } from '../../../Server/Domain/Enums/FeatureNames'
import { FeatureTypes } from '../../../Server/Domain/Enums/FeatureTypes'
import RandomEnumValue from './Randoms/RandomEnumValue'

type MockOptionals = Partial<Feature>

export default class FeatureMock {
  static GetRandom(optionals? : MockOptionals) : Feature {
    const entity : Feature = {
      id: optionals?.id || null,
      name: optionals?.name || RandomEnumValue(FeatureNames),
      type: optionals?.type || RandomEnumValue(FeatureTypes),
      createdAt: DateUtils.DateNow(),
      updatedAt: DateUtils.DateNow(),
      isActive: faker.datatype.boolean(),
    }

    return entity
  }
}
