/* eslint-disable no-return-await */
import {
  Body, HttpCode, JsonController, Post, Req, UseBefore,
} from 'routing-controllers'
import { Service } from 'typedi'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import Bot from '../../../../../Domain/Entities/Bot'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import CreateBotRequest from './Requests/CreateBot/CreateBotRequest'

@Service()
@JsonController('/account-management/bot')
export default class BotController extends BaseCrudController<Bot> {
  /**
   *
   */
  constructor(
      private repository : BotRepository,
  ) {
    super(repository)
  }

  @HttpCode(201)
  @Post('')
  @UseBefore(TokenAuthentication)
  public async CreateBot(
    @Body({ validate: { skipMissingProperties: true } }) body : CreateBotRequest,
    @Req() req : IAuthenticatedRequest,
  ) : Promise<Bot> {
    const bot = Mapper.map(body, CreateBotRequest, Bot, { extraArgs: () => ({ userId: req.user.id }) })
    const insertedBot = await super.Create(bot)

    return insertedBot
  }
}
