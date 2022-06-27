import { faker } from '@faker-js/faker'
import Bot from '../../../Server/Domain/Entities/Bot'
import StepMock from './StepMock'

type MockOptionals = Partial<Bot>

export default class BotMock {
  public static GetRandom(optionals? : MockOptionals) : Partial<Bot> {
    let bot : Partial<Bot> = {
      botName: faker.name.firstName(),
      id: faker.datatype.number(10000),
      steps: [
        StepMock.GetRandomSimpleStep(),
        StepMock.GetRandomOptionsStep(),
      ],
    }

    if (optionals) {
      bot = {
        ...bot,
        ...optionals,
      }
    }

    return bot
  }
}
