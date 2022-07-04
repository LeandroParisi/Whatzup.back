import { faker } from '@faker-js/faker'
import StepTypes from '../../../Server/Domain/Entities/Steps/Enums/StepTypes'
import { OptionsStepInfo } from '../../../Server/Domain/Entities/Steps/OptionsStep/OptionsStepInfo'
import { StepInfo } from '../../../Server/Domain/Entities/Steps/Step'

type MockOptionalsOptions = Partial<OptionsStepInfo>

type MockOptionalsSimple = Partial<StepInfo>

export default class StepMock {
  public static GetRandomSimpleStep(optionals? : MockOptionalsSimple) : StepInfo {
    const step : StepInfo = {
      id: optionals?.id || faker.datatype.number(),
      introMessage: optionals?.introMessage || [faker.datatype.string(10000)],
      name: optionals?.name || faker.name.findName(),
      type: optionals?.type || StepTypes.Simple,
    }

    return step
  }

  public static GetRandomOptionsStep(optionals? : MockOptionalsOptions) : OptionsStepInfo {
    const step : OptionsStepInfo = {
      id: optionals?.id || faker.datatype.number(),
      introMessage: optionals?.introMessage || [faker.datatype.string(10000)],
      name: optionals?.name || faker.name.findName(),
      type: optionals?.type || StepTypes.Options,
      options: optionals?.options || [
        {
          name: faker.name.findName(),
          nextStepId: faker.datatype.number({ min: 1, max: 10 }),
          outboundMessages: [faker.datatype.string(10000)],
          selectionKey: 1,
        },
        {
          name: faker.name.findName(),
          nextStepId: faker.datatype.number({ min: 1, max: 10 }),
          outboundMessages: [faker.datatype.string(10000)],
          selectionKey: 2,
        },
      ],
    }

    return step
  }
}
