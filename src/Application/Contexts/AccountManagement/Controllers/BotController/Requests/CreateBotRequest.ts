import { IsNumber, IsString } from 'class-validator'
import { isTypedArray } from 'util/types'
import Bot from '../../../../../../Domain/Entities/Bot'
import { Step } from '../../../../../../Domain/Entities/Steps/Step'

export default class CreateBotRequest implements Partial<Bot> {
  @IsNumber()
  readonly userId : number

  @IsString()
  readonly botName : string

  readonly steps : Step[]
}
