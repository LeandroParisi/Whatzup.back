import { Body, Controller, Post } from 'routing-controllers'
import { Service } from 'typedi'
import Bot from '../../../../../Domain/Entities/Bot'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'

@Service()
@Controller('/account-management/bot')
export default class BotController extends BaseCrudController<Bot> {
  // @Post('')
  // public async Create(@Body() body : Partial<Bot>) {

  // }
}
