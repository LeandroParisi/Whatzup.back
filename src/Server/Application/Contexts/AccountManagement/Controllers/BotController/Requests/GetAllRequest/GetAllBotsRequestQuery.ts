/* eslint-disable max-classes-per-file */
import { IsString } from 'class-validator'
import Bot from '../../../../../../../Domain/Entities/Bot'

export default class GetAllBotsRequestQuery implements Partial<Bot> {
  @IsString()
  botName : string
}
