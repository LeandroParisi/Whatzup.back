/* eslint-disable max-classes-per-file */
import Bot from '../../../../../../Domain/Entities/Bot'
import { Step } from '../../../../../../Domain/Entities/Steps/Step'

export class BotDTO implements Partial<Bot> {
  readonly botName : string

  readonly steps : Step[]

  /**
   *
   */
  constructor(botName : string, steps : Step[]) {
    this.botName = botName
    this.steps = steps
  }
}
