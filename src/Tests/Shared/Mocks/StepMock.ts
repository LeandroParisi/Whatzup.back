import { faker } from '@faker-js/faker'
import StepTypes from '../../../Server/Domain/Entities/Steps/Enums/StepTypes'
import { OptionsStepInfo } from '../../../Server/Domain/Entities/Steps/OptionsStep/OptionsStepInfo'
import { StepInfo } from '../../../Server/Domain/Entities/Steps/Step'

type MockOptionalsOptions = Partial<OptionsStepInfo>

type MockOptionalsSimple = Partial<StepInfo>

export default class StepMock {
  public static GetRandomSimpleStep(optionals? : MockOptionalsSimple) : StepInfo {
    let step : StepInfo = {
      id: faker.datatype.number({ min: 1, max: 1000000 }),
      introMessage: [faker.datatype.string(10000)],
      name: faker.name.findName(),
      type: StepTypes.Simple,
    }

    if (optionals) {
      step = {
        ...step,
        ...optionals,
      }
    }

    return step
  }

  public static GetRandomOptionsStep(optionals? : MockOptionalsOptions) : OptionsStepInfo {
    let step : OptionsStepInfo = {
      id: faker.datatype.number(100000),
      introMessage: [faker.datatype.string(10000)],
      name: faker.name.findName(),
      type: StepTypes.Options,
      options: [
        {
          name: faker.name.findName(),
          nextStep: faker.datatype.number({ min: 1, max: 10 }),
          outboundMessages: [faker.datatype.string(10000)],
          selectionKey: 1,
        },
        {
          name: faker.name.findName(),
          nextStep: faker.datatype.number({ min: 1, max: 10 }),
          outboundMessages: [faker.datatype.string(10000)],
          selectionKey: 2,
        },
      ],
    }

    if (optionals) {
      step = {
        ...step,
        ...optionals,
      }
    }

    return step
  }
}
