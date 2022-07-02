import { faker } from '@faker-js/faker'
import DateUtils from '../../../Server/Commons/Utils/DateUtils'
import Plan from '../../../Server/Domain/Entities/Plan'

type MockOptionals = Partial<Plan>

export default class PlanMock {
  static GetRandom(optionals? : MockOptionals) : Plan {
    const plan : Plan = {
      id: optionals?.id || null,
      name: optionals?.name || faker.name.findName(),
      isCustomPlan: optionals?.isCustomPlan || false,
      price: optionals?.price || Number(faker.finance.amount()),
      createdAt: DateUtils.DateNow(),
      updatedAt: DateUtils.DateNow(),
      isActive: faker.datatype.boolean(),
    }

    return plan
  }
}
